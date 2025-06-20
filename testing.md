# CRM Report: Data Definitions and Metrics

## Table of Contents
* [Report Filters](#report-filters)
* [Report Usage](#report-usage)
* [KPI Definitions](#kpi-definitions)
* [Department Definitions](#department-definitions)
* [Interpretting Results](#interpretting-results)
* [Additional Features](#additional-features)
* [KPI Metrics](#kpi-metrics)
* [Department Trends](#department-trends)
* [Averages vs Benchmarks](#averages-vs-benchmarks)


## Report Filters

*   **All Stores / Single Store:** 
    *   These buttons allow you to switch reporting between the banner level and individual store level.
    *   Please review the bottom of this documentation to understand average differences.
    *   ![Report Image](https://imgur.com/Y0V7N8O.png)
*   **Year:** 
    *   This allows you to filter which year you would like to evaluate.
    *  ![Year Image](https://imgur.com/SJF5NFm.png)
*   **Banner:**
    *   This allows you to filter between NSM and NLCM.
    *   ![Banner Image](https://imgur.com/yv84sto.png)
*   **Customer Type:**
    *   This will allow you to filter between "Loyalty", "Non-Loyalty", and "All" customer types.
    *   ![Customer Type Image](https://imgur.com/mFyJDVc.png)
*   **Store:** 
    *   This allows you to filter by store, and is only availible in the "Single Store" view.
    *   Only one store's metrics can be displayed at a time.
    *   ![Store Image](https://imgur.com/o8asS4i.png)
   
## Report Usage
*    **Metric Tiles:**
     *    Every graph will display the current and previous year's monthly metrics on hover.
     *    The card underneath is the *year-to-date* summary of that metric.
     *    ![Metric Rank Image](https://imgur.com/A7jwRMf.png)

*    **Single Store Metric Rankings:** 
     *    When in the **Single Store** view, you can toggle the information button to compare year-to-date metrics against other stores.
     *    ![Metric Rank Image](https://imgur.com/AMpg5pv.png)


## KPI Definitions

This section includes *monthly* and *yeart-to-date* summaries that breaks down share of target metrics.

### 1. New Enrollments

*   **Description:** 
    *   Summing the unique count of newly enrolled customers for all locations, including SMS and Website, based on enrollment date.

### 2. Active Customers

*   **Description:** 
    *   Active customers is how many **unique** customers shopped in the selected period.

### 3. Churn Rate

*   **Description:** 
    *   Churn Rate is percentage of total customers that did not shop for 28 days after their last purchase. 
    *   Churn allocation will be applied to the last store someone shopped at when viewing Single Store.
    *   This metric will populate up until the prior month close, because it is a function of time that has ultimately not occured yet.
*   **Calculation:** 
    *   `Churned Customers / Customers`
  
### 4. Transactions

*   **Description:** 
    *   The count of unique transactions in a given time period.

### 5. Average Basket

*   **Description:** 
    *   The average gross value of a basket, before discount/tax/deposit.
*   **Calculation:** 
    *   `Gross Revenue / Transactions`
### 6. Frequency

*   **Description:** 
    *   This is how many transactions the average customer made during a given period.
*   **Calculation:** 
    *   `Transactions / Customers`

### 7. Offer Redemptions

*   **Description:** 
    *   This is how many total offers were redeemed. 
    *   (This does not include the $5 Reward, Birthday Treat, or Bevie Bonus.)

### 8. Offers Redemptions Per Customer

*   **Description:** 
    *   This is how many total offers were redeemed per customer.
    *   The goal of this metric is to see how *deeply* customers engaged with the Loyalty program's offers in a given time period.
    *   (This does not include the $5 Reward, Birthday Treat, or Bevie Bonus.)
*   **Calculation:** 
    *   `Offer Redemptions / Redeeming Customers`

### 9. Offer Customer Engagement

*   **Description:** 
    *   Offer engagement is how many Loyalty customers reedemed an offer out of all actuve Loyalty customers. 
    *   The goal of this metric is to focus on how *appealing* the Loyalty program's offers were in a given time period.
    *   (This does not include the $5 Reward, Birthday Treat, or Bevie Bonus.)
*   **Calculation:** 
    *   `Redeeming Customers / Customers`


## Department Definitions

This section is a *yeart-to-date* summary that breaks down share of cart by content and total revenue contribution by department.

### 1. Revenue:
*   **Description:** 
    * The total gross revenue spent in the
### 2. Transactions:
*   **Description:** 
    * The total number of transactions that contained an item from the department. 
### 3. Avg Basket:
*   **Description:** 
    * The average spend per transactions containing an item from the department.
### 4. Rank: (Single Store View)
*   **Description:** 
    * This ranks total gross revenue by department across stores.
### 5. vs Avg: (Single Store View)
*   **Description:** 
    * This compares each metric (Revenue/Transactions/Avg Basket) against other stores' current averages in the department.


# Averages vs Benchmarks

There will be two sections in this report: **All Stores** and **Single Store**.

**All Stores** asks: "What is the *customer* average?"

**Single Store** asks: "What is the *store* average?"

## Example

We'll use **Frequency** as an example:

| Customer | Store A | Store B | Store C |
| :--- | :---: | :---: | :---: |
| Alice    | 3 | 1 | 0 |
| Bob      | 2 | 0 | 0 |
| Charlie  | 1 | 2 | 1 |

---
**The Customer Average ("All Stores")**

This method puts all trips and all customers into one big pool.

*   **Total Trips:** 10
*   **Total Unique Customers:** 3
*   **Resulting Average:** `10 / 3` = **3.33**

---
**The Store Average ("Single Store")**

This method finds the average for each store first, and is the average of averages. It gives every store, big or small, an equal vote.

*   **Store A Frequency:**
    *   Trips: 6
    *   Customers: 3
    *   Result: `6 / 3` = **2.0**

*   **Store B Frequency:**
    *   Trips: 3
    *   Customers: 2
    *   Result: `3 / 2` = **1.5**

*   **Store C Frequency:**
    *   Trips: 1
    *   Customers: 1
    *   Result: `1 / 1` = **1.0**

Now, we average those individual store results:
*   **Final Store Average:** `(2.0 + 1.5 + 1.0) / 3` = **1.5**

## The Bottom Line:

Both the **Customer Average (3.33)** and the **Store Average (1.5)** are correct numbers, but they answer different business questions.

*   The **Customer Average** is the best metric for measuring customer behavior. 

*   The **Store Average** is the best metric for creating a fair benchmark to compare stores against each other.

Charting Store A's performance (2.0) against the All Store average (3.33) would be demoralizing and useless, as it's a target that stores can't meet. We need a fair and actionable benchmark, showing how that store is performing relative to its peers. It is very important that you differentiate the two when sharing reporting to a larger audience!

--- 