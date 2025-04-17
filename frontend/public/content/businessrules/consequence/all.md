
# Key Components of Curation Rules

## 1. Trigger

Triggers define the conditions under which a rule is applied. The primary trigger type is the **query**, which activates specific consequences based on the user's search input.

### Example:

- Trigger: When the query is "shirts".

## 2. Consequences

Consequences determine what actions are taken when a trigger condition is met. The following types of consequences are available:

### a. Pin

Pins allow specific products to be placed at designated positions in the search results.

- **What is Pin?**
  Pinning ensures that selected products appear at specified positions in the search results, overriding the default ranking algorithm.

- **How to Set Pin?**
  Specify the product identifiers and their desired positions (e.g., pinning the first 20 curated products for a query).

- **When to Use Pin?**
  Use pinning to promote specific products that align with marketing campaigns or business goals.

### Example:

- Pin the first 20 curated products when the query is "shirts".

### b. Hide

Hiding removes specific products or attributes from the search results.

- **What is Hide?**
  Hiding excludes unwanted products or attributes from appearing in the search results.

- **How to Set Hide?**
  Define the product identifiers or attributes to be hidden.

- **When to Use Hide?**
  Use hiding to exclude products that are out of stock, irrelevant, or inappropriate for certain queries.

### Example:

- Hide all products with the attribute "damaged" when the query is "jackets".

### c. Boost/Bury

Boosting increases the ranking of selected products, while burying decreases it.

- **What is Boost/Bury?**
  Boosting prioritizes specific products by improving their ranking, whereas burying reduces their visibility by lowering their ranking.

- **How to Set Boost/Bury?**
  Assign ranking adjustments to products or categories based on relevance or business priorities.

- **When to Use Boost/Bury?**
  Use boosting to highlight featured products or burying to deprioritize less relevant items.

### Example:

- Boost "summer shirts" when the query is "shirts".
- Bury "wool coats" when the query is "summer clothing".

### d. Filter

Filters apply hard constraints to the search results.

- **What is Filter?**
  Filtering ensures that only products meeting specific criteria are displayed in the search results.

- **How to Set Filter?**
  Define filter conditions based on product attributes (e.g., category, price range, availability).

- **When to Use Filter?**
  Use filters to refine results for seasonal promotions, regional preferences, or customer-specific needs.

### Example:

- Show only products with the attribute "available" when the query is "pants".

### e. Redirect

Redirects send the user to a specified URL based on their query.

- **What is Redirect?**
  Redirecting bypasses the default search results and directs the user to a predefined URL.

- **How to Set Redirect?**
  Define a mapping between the query and the destination URL.

- **When to Use Redirect?**
  Use redirects to guide users to curated landing pages, promotional pages, or external resources.

### Example:

- Redirect the query "black friday deals" to "https://example.com/black-friday".

## Practical Applications

1. **Marketing Campaigns**: Pinning or boosting promotional products.

2. **Inventory Management**: Hiding out-of-stock items or filtering by availability

3. **User Experience**: Redirecting to specialized pages for complex queries.

By utilizing these curation rules, clients can optimize search results to meet user expectations, enhance engagement, and drive business outcomes.
