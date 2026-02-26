
-- Create budget_categories table for per-user, per-month budgets
CREATE TABLE public.budget_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  category text NOT NULL,
  budget_amount numeric NOT NULL DEFAULT 0,
  month text NOT NULL, -- format: YYYY-MM
  priority text NOT NULL DEFAULT 'important',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own budget_categories"
  ON public.budget_categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own budget_categories"
  ON public.budget_categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budget_categories"
  ON public.budget_categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budget_categories"
  ON public.budget_categories FOR DELETE
  USING (auth.uid() = user_id);

-- Unique constraint per user/category/month
ALTER TABLE public.budget_categories
  ADD CONSTRAINT unique_user_category_month UNIQUE (user_id, category, month);
