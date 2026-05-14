# simplycook-shopping-cart

A small in-memory Shopping Cart REST API built with NestJS and TypeScript.

## Run locally

All commands below are shown with Yarn, but the npm equivalents work too if you prefer.

Install dependencies:

```bash
yarn install
```

Build the production bundle:

```bash
yarn build
```

Run the compiled build:

```bash
yarn start
```

Once running:

- Interactive Swagger UI: <http://localhost:4000/docs>
- Health check: <http://localhost:4000/health>
- Cart API base path: <http://localhost:4000/carts>

## Run tests

If you want to confirm the unit tests work you can open a new terminal and run:

```bash
yarn test
```

## Test the endpoints with Swagger UI

1. Start the API with `yarn start:dev`.
2. Open <http://localhost:4000/docs>.
3. Expand an endpoint.
4. Click `Try it out`.
5. Send the request and inspect the response body.

Recommended order:

1. `POST /carts`
2. Copy the returned `id`
3. `POST /carts/{cartId}/items`
4. `GET /carts/{cartId}`
5. `PATCH /carts/{cartId}/items/{productId}`
6. `DELETE /carts/{cartId}/items/{productId}` or `DELETE /carts/{cartId}/items`

Note: For this app 


## API

All cart endpoints are documented and executable from `/docs`. Summary:

| Method | Path                                  | Purpose                                          |
| ------ | ------------------------------------- | ------------------------------------------------ |
| POST   | `/carts`                              | Create a new empty cart                          |
| GET    | `/carts/:cartId`                      | Get cart with computed `totals`                  |
| POST   | `/carts/:cartId/items`                | Add an item (merges quantity if already present) |
| PATCH  | `/carts/:cartId/items/:productId`     | Update quantity (`0` removes the item)           |
| DELETE | `/carts/:cartId/items/:productId`     | Remove a single item                             |
| DELETE | `/carts/:cartId/items`                | Clear all items                                  |


## Design decisions

- I used NestJS because it gives me a clean module, controller, and service structure without a lot of setup code.
- I used `ValidationPipe` with `class-validator` DTOs so invalid requests are rejected at the edge of the API. That keeps the service layer simpler because it can assume things like `productId`, `quantity`, and `unitPrice` are already in the right shape.
- When the same `productId` is added twice, I merge the quantity instead of creating two separate lines.
- I treated `PATCH quantity: 0` as a remove action. It keeps the API simple to use while still enforcing the rule that stored cart items should never have a quantity below `1`.
- I store a copy of the item's `metadata` in the cart so the response does not unexpectedly change if product data changes later.
- Cart totals are computed on read rather than stored separately. That avoids the classic problem of totals drifting out of sync with the underlying items.
- I added Swagger UI at `/docs` because it makes the API much easier to review and test manually without needing Postman or curl commands.

## Trade-offs

- The cart is stored in memory, so restarting the server clears everything. That is fine for this exercise, but it would not be enough for a real production service.
- I kept `unitPrice` as a `number` to keep the implementation small, but that does mean there is still some floating-point risk. I round totals to two decimal places, though a dedicated money type would be the better long-term model.
- The API currently lets the client send the price. In a real ecommerce system the server should look pricing up from a trusted product or catalogue service.
- There is no auth in this version, so anyone with a `cartId` can read or update that cart.
- I deliberately left out inventory, discounts, tax, shipping, and multi-currency so the solution stayed focused on the core cart behaviour.

## Persistence strategy (if more time)

The `CartService` keeps the storage logic in one place, which makes it easier to swap the in-memory `Map` for a real data store later:

- Postgres would probably be my default next step. I would model `cart` and `cart_item` tables and use a `version` column for optimistic locking so concurrent updates do not silently overwrite each other.
- Redis would also be a good fit for guest carts. A key like `cart:{id}` with a TTL would give fast reads and writes, and expired carts could clean themselves up naturally.

## What I'd improve with more time

- Introduce a proper money type like `{ amountMinor, currency }` so pricing is safer and ready for multi-currency support.
- Add auth and user-linked carts so carts can persist across sessions and merge cleanly when a guest user signs in.
- Move pricing and product lookup server-side so the client cannot control the price being added to the cart.
- Add idempotency keys on `POST /carts/:id/items` so retrying a request does not accidentally double-add items.
- Add inventory checks or reservation logic when items are added.
- Add coupon, tax, and shipping calculation once the cart rules become more realistic.
- Add rate limiting on mutation endpoints.

## Things I learned in this test

There is always an opportunity to learn, even with tests like these.

- Even in a small service, pushing validation to the edge with DTOs and `ValidationPipe` makes the business logic easier to read and reason about.

