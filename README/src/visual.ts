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
import "./../style/visual.less";
import * as marked from "marked";
import DOMPurify from "dompurify";
import "github-markdown-css";      // GitHub's own CSS

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import { VisualFormattingSettingsModel } from "./settings";

export class Visual implements IVisual {
    private target: HTMLElement;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;

    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);
        this.formattingSettingsService = new FormattingSettingsService();
        this.target = options.element;
        this.target.classList.add("markdown-body");
        
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

        // 1️⃣ Extract Markdown text from the single row we mapped in capabilities.json
        const markdown = options?.dataViews?.[0]
            ?.categorical?.categories?.[0]
            ?.values?.[0] as string || "";

        // 2️⃣ Convert Markdown → raw HTML with header IDs enabled
        marked.use({
            gfm: true,
            breaks: true,
            pedantic: false
        });
        
        const html = marked.parse(markdown) as string;

        // 3️⃣ Sanitize to avoid XSS
        const safeHtml = DOMPurify.sanitize(html, {
            ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
                          'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img', 'table', 
                          'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'del', 'span', 'div'],
            ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id']
        });
        
        // 4️⃣ Inject into the visual's container
        this.target.innerHTML = safeHtml;

        // 5️⃣ Set up internal link navigation
        this.setupInternalLinks();

        // 6️⃣ Apply formatting pane settings if available
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
                this.target.style.fontFamily = String(viewer.fontFamily.value);
            }
        }
    }

    /**
     * Set up click handlers for internal markdown links
     */
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

    /**
     * Ensure target elements have proper IDs for navigation
     */
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

    /**
     * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
     * This method is called once every time we open properties pane or when the user edit any format property. 
     */
    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}