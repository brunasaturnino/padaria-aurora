CREATE TABLE IF NOT EXISTS orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  items jsonb NOT NULL,
  coupon_code text NOT NULL,
  subtotal_cents integer NOT NULL CHECK (subtotal_cents >= 0),
  discount_cents integer NOT NULL CHECK (discount_cents >= 0),
  total_cents integer NOT NULL CHECK (total_cents >= 0),
  payment_method text NOT NULL CHECK (payment_method IN ('dinheiro', 'pix', 'cartao')),
  paid_cents integer NOT NULL CHECK (paid_cents >= 0),
  change_cents integer NOT NULL CHECK (change_cents >= 0)
);
