+++
title = "Supabase row-level security, the parts that bit me"
date = 2025-12-04

[taxonomies]
tags = ["supabase", "webdev"]

[extra]
dek = "The policies I got wrong first, and a mental model that stuck."
+++

RLS is great until a query silently returns nothing and you can't tell whether it's a bug or a policy. The mental model that helped: every row read is a boolean test, and the default answer is no.

The two mistakes I made early were forgetting policies apply to the service role differently, and writing policies that referenced columns the client never selected.

Once I started testing policies as their own unit — seed a row, switch roles, assert visibility — the surprises stopped.
