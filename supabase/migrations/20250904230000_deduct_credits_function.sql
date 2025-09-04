create or replace function deduct_credits(user_id_input uuid, cost integer)
returns integer as $$
declare
  new_amount integer;
begin
  update user_credits
  set amount = amount - cost
  where user_id = user_id_input and amount >= cost
  returning amount into new_amount;

  if new_amount is null then
    raise exception 'Insufficient credits';
  end if;

  return new_amount;
end;
$$ language plpgsql;
