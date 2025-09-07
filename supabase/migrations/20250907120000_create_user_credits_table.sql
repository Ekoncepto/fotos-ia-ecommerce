-- Create the user_credits table
CREATE TABLE public.user_credits (
  user_id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL DEFAULT 50
);

-- Enable Row Level Security
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own credits" ON public.user_credits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own credit entry" ON public.user_credits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits" ON public.user_credits FOR UPDATE
  USING (auth.uid() = user_id);
