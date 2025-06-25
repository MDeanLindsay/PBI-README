/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import { createTooltipServiceWrapper, ITooltipServiceWrapper } from "powerbi-visuals-utils-tooltiputils";
import "./../style/visual.less";
import * as marked from "marked";
import DOMPurify from "dompurify";
import "github-markdown-css"; 

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import ISelectionManager = powerbi.extensibility.ISelectionManager;

import { VisualFormattingSettingsModel } from "./settings";

export class Visual implements IVisual {
    private target: HTMLElement;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;
    private tooltipServiceWrapper: ITooltipServiceWrapper;
    private selectionManager: ISelectionManager;
    private host: powerbi.extensibility.visual.IVisualHost;
    private dataSelectionId: powerbi.visuals.ISelectionId;

    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);
        this.formattingSettingsService = new FormattingSettingsService();
        this.host = options.host;
        this.target = options.element;
        this.target.classList.add("markdown-body");
        
        // Initialize tooltip service wrapper
        this.tooltipServiceWrapper = createTooltipServiceWrapper(
            this.host.tooltipService,
            options.element
        );
        
        // Initialize selection manager
        this.selectionManager = this.host.createSelectionManager();
        
        // Set up accessibility attributes
        this.setupAccessibility();
        
        // Ensure the container has proper dimensions and overflow for scrolling
        this.target.style.width = "100%";
        this.target.style.height = "100%";
        this.target.style.overflow = "auto";
        this.target.style.boxSizing = "border-box";
    }

    public update(options: VisualUpdateOptions): void {
        // Build/refresh formatting settings model from dataView
        if (options.dataViews && options.dataViews.length > 0) {
            this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(
                VisualFormattingSettingsModel,
                options.dataViews[0]
            );
        }

        // Create selection ID for the data point (single markdown content)
        this.createDataSelectionId(options);

        // Extract Markdown text from the single row we mapped in capabilities.json
        const markdown = options?.dataViews?.[0]
            ?.categorical?.categories?.[0]
            ?.values?.[0] as string || "";

        // Convert Markdown to raw HTML with GitHub-flavored markdown enabled
        marked.use({
            gfm: true,
            breaks: true,
            pedantic: false
        });
        
        const html = marked.parse(markdown) as string;

        // Sanitize HTML to prevent XSS attacks
        const safeHtml = DOMPurify.sanitize(html, {
            ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
                          'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img', 'table', 
                          'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'del', 'span', 'div'],
            ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id']
        });
        
        // Inject sanitized HTML into the visual's container
        // ESLint rule "powerbi-visuals/no-inner-outer-html" forbids assigning to
        // innerHTML/outerHTML. Instead, parse the sanitised HTML into a
        // DocumentFragment and append it, clearing any previous children first.

        // Remove any existing child nodes
        while (this.target.firstChild) {
            this.target.removeChild(this.target.firstChild);
        }

        // Convert the safe HTML string into DOM nodes and append
        const fragment = document.createRange().createContextualFragment(safeHtml);
        this.target.appendChild(fragment);

        // Set up internal link navigation
        this.setupInternalLinks();

        // Apply formatting pane settings if available
        if (this.formattingSettings?.viewerCard) {
            const viewer = this.formattingSettings.viewerCard;
            
            if (viewer.fontSize?.value !== undefined) {
                this.target.style.setProperty('--base-font-size', `${viewer.fontSize.value}px`);
                this.target.style.fontSize = `${viewer.fontSize.value}px`;
            }
            if (viewer.padding?.value !== undefined) {
                this.target.style.padding = `${viewer.padding.value}px`;
            }
            if (viewer.backgroundColor?.value?.value) {
                this.target.style.background = viewer.backgroundColor.value.value;
            }
            if (viewer.fontFamily?.value) {
                const fontFamily = String(viewer.fontFamily.value);
                this.target.style.setProperty('--custom-font-family', fontFamily);
            }
        }

        // Set up accessibility features
        this.setupKeyboardNavigation();
        this.setupTooltips();
        this.setupContextMenu();
        
        // Set up selection interaction (conditional based on settings)
        this.setupSelection();
    }

     // Set up click handlers for internal markdown links
    private setupInternalLinks(): void {
        // Find all anchor tags with href starting with #
        const internalLinks = this.target.querySelectorAll('a[href^="#"]');
        
        internalLinks.forEach((link: HTMLAnchorElement) => {
            link.addEventListener('click', (event: Event) => {
                // Don't prevent default - let browser handle the hash navigation
                const targetId = link.getAttribute('href')!.substring(1);
                
                // Ensure target element exists, create ID if needed
                this.ensureTargetExists(targetId);
                
                // Use native hash navigation - simplest approach
                setTimeout(() => {
                    window.location.hash = targetId;
                }, 10);
            });
        });
    }

     // Ensure target elements have proper IDs for navigation
    private ensureTargetExists(targetId: string): void {
        let targetElement = this.target.querySelector(`#${targetId}`);
        
        if (!targetElement) {
            // Find heading by text content and add ID
            const headings = this.target.querySelectorAll('h1, h2, h3, h4, h5, h6');
            for (let i = 0; i < headings.length; i++) {
                const heading = headings[i];
                const headingText = heading.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                if (headingText === targetId) {
                    heading.id = targetId;
                    targetElement = heading;
                    break;
                }
            }
        }
    }

    // Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
    // This method is called once every time we open properties pane or when the user edit any format property. 
    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }

    // Set up basic accessibility attributes for the root element
    private setupAccessibility(): void {
        // Add keyboard focus capability
        this.target.setAttribute('tabindex', '0');
        
        // Add ARIA label for screen readers
        this.target.setAttribute('aria-label', 'Markdown document');
        this.target.setAttribute('role', 'document');
        
        // Add a title attribute for additional context
        this.target.setAttribute('title', 'Markdown content viewer - Use arrow keys to navigate');
    }

    // Set up keyboard navigation for focusable elements
    private setupKeyboardNavigation(): void {
        // Handle keyboard events on the container
        this.target.addEventListener('keydown', (event: KeyboardEvent) => {
            this.handleKeyboardNavigation(event);
        });

        // Set up tab navigation for links and headers
        const focusableElements = this.target.querySelectorAll('a, h1, h2, h3, h4, h5, h6');
        focusableElements.forEach((element, index) => {
            const htmlElement = element as HTMLElement;
            htmlElement.setAttribute('tabindex', '0');
            
            // Add navigation help via aria-label
            if (element.tagName.startsWith('H')) {
                htmlElement.setAttribute('aria-label', `Heading level ${element.tagName.slice(1)}: ${element.textContent}`);
            }
        });
    }

    //Handle keyboard navigation events
    private handleKeyboardNavigation(event: KeyboardEvent): void {
        const focusableElements = Array.from(this.target.querySelectorAll('a, h1, h2, h3, h4, h5, h6')) as HTMLElement[];
        const currentFocusIndex = focusableElements.indexOf(document.activeElement as HTMLElement);

        switch (event.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                event.preventDefault();
                const nextIndex = (currentFocusIndex + 1) % focusableElements.length;
                if (focusableElements[nextIndex]) {
                    focusableElements[nextIndex].focus();
                }
                break;
            
            case 'ArrowUp':
            case 'ArrowLeft':
                event.preventDefault();
                const prevIndex = currentFocusIndex <= 0 ? focusableElements.length - 1 : currentFocusIndex - 1;
                if (focusableElements[prevIndex]) {
                    focusableElements[prevIndex].focus();
                }
                break;
            
            case 'Home':
                event.preventDefault();
                if (focusableElements[0]) {
                    focusableElements[0].focus();
                }
                break;
            
            case 'End':
                event.preventDefault();
                if (focusableElements[focusableElements.length - 1]) {
                    focusableElements[focusableElements.length - 1].focus();
                }
                break;
        }
    }

    // Set up tooltips for accessibility
    private setupTooltips(): void {
        // Add simple title attributes for tooltips instead of complex tooltip service
        // This provides keyboard accessibility without complex d3 selection requirements
        
        const links = this.target.querySelectorAll('a[href]');
        links.forEach((link: HTMLAnchorElement) => {
            const href = link.getAttribute('href');
            const text = link.textContent || href;
            const tooltipText = href?.startsWith('#') 
                ? `Internal link to: ${href.substring(1)}` 
                : `Link to: ${href}`;
            
            link.setAttribute('title', tooltipText);
            link.setAttribute('aria-describedby', `tooltip-${Date.now()}-${performance.now()}`);
        });

        // Add tooltips to code blocks showing first 120 chars
        const codeBlocks = this.target.querySelectorAll('code, pre');
        codeBlocks.forEach((code: HTMLElement) => {
            const content = code.textContent || '';
            if (content.length > 20) {
                const tooltipText = content.substring(0, 120) + (content.length > 120 ? '...' : '');
                code.setAttribute('title', tooltipText);
                code.setAttribute('aria-label', `Code block: ${tooltipText}`);
            }
        });
    }

    // Set up context menu accessibility
    private setupContextMenu(): void {
        // Add context menu support
        this.target.addEventListener('contextmenu', (event: MouseEvent) => {
            this.showContextMenu(event);
        });

        // Add Shift + F10 support for keyboard context menu
        this.target.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.shiftKey && event.key === 'F10') {
                event.preventDefault();
                this.showContextMenu();
            }
        });
    }

    // Show context menu at position or current focused element
    private showContextMenu(event?: MouseEvent): void {
        const position = event ? { x: event.clientX, y: event.clientY } : undefined;
        
        // Use the data selection ID if available, otherwise create a simple one
        const selectionId = this.dataSelectionId || this.host.createSelectionIdBuilder().createSelectionId();

        this.selectionManager.showContextMenu(selectionId, position);
    }

    // Create selection ID for the markdown data point
    private createDataSelectionId(options: VisualUpdateOptions): void {
        if (options.dataViews && options.dataViews[0] && options.dataViews[0].categorical) {
            const categorical = options.dataViews[0].categorical;
            
            // Create selection ID for the first (and only) data point
            if (categorical.categories && categorical.categories[0] && categorical.categories[0].values.length > 0) {
                this.dataSelectionId = this.host.createSelectionIdBuilder()
                    .withCategory(categorical.categories[0], 0)
                    .createSelectionId();
            }
        }
    }

    /**
     * Set up selection interaction for the visual
     * 
     * This method handles two modes:
     * 1. Text Selection Mode (default): Users can select and copy text from the markdown
     * 2. Power BI Selection Mode: Visual participates in cross-highlighting but text selection is disabled
     * 
     * The mode is controlled by the "Enable text selection" setting in the formatting pane.
     */
    private setupSelection(): void {
        // Always register selection changed event handler for cross-highlighting
        this.selectionManager.registerOnSelectCallback(() => {
            this.onSelectionChanged();
        });

        // Only add click handler if text selection is disabled
        const enableTextSelection = this.formattingSettings?.viewerCard?.enableTextSelection?.value ?? true;
        
        if (!enableTextSelection) {
            // Handle clicks on the container to select/deselect the data point
            this.target.addEventListener('click', (event: MouseEvent) => {
                // Don't trigger selection on link clicks or other interactive elements
                if ((event.target as HTMLElement).tagName === 'A') {
                    return;
                }
                
                // Don't trigger selection if user is selecting text
                if (window.getSelection()?.toString()) {
                    return;
                }
                
                this.handleSelection(event);
            });
            
            // Remove text selection mode class and enable Power BI selection
            this.target.classList.remove('text-selection-mode');
        } else {
            // Enable text selection mode
            this.target.classList.add('text-selection-mode');
        }
    }

    // Handle selection of the markdown data point
    private handleSelection(event?: MouseEvent): void {
        if (this.dataSelectionId) {
            // Toggle selection on click
            const isCtrlPressed = event?.ctrlKey || event?.metaKey;
            
            this.selectionManager.select(this.dataSelectionId, isCtrlPressed)
                .then((selectionIds: powerbi.visuals.ISelectionId[]) => {
                    // Selection completed - update visual state if needed
                    this.onSelectionChanged();
                });
        }
    }

    // Handle selection changes (including clear from other visuals)
    private onSelectionChanged(): void {
        const selection = this.selectionManager.getSelectionIds();
        
        // Check if our data point is selected by comparing selection arrays
        const isSelected = selection.length > 0 && this.dataSelectionId !== null;

        // Update visual appearance based on selection state
        this.updateSelectionState(isSelected);
    }

    // Update visual appearance based on selection state
    private updateSelectionState(isSelected: boolean): void {
        const enableTextSelection = this.formattingSettings?.viewerCard?.enableTextSelection?.value ?? true;
        
        // Only show selection styling if not in text selection mode
        if (!enableTextSelection) {
            if (isSelected) {
                this.target.classList.add('selected');
                this.target.style.borderLeft = '4px solid var(--pbi-color-foreground, #0078d4)';
                this.target.style.backgroundColor = 'var(--pbi-color-background-selected, rgba(0, 120, 212, 0.1))';
            } else {
                this.target.classList.remove('selected');
                this.target.style.borderLeft = '';
                this.target.style.backgroundColor = this.formattingSettings?.viewerCard?.backgroundColor?.value?.value || 'transparent';
            }
        } else {
            // In text selection mode, remove any selection styling
            this.target.classList.remove('selected');
            this.target.style.borderLeft = '';
            this.target.style.backgroundColor = this.formattingSettings?.viewerCard?.backgroundColor?.value?.value || 'transparent';
        }
    }
}