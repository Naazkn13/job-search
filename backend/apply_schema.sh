#!/usr/bin/env bash
# Apply the Supabase schema
# Run this SQL in Supabase Dashboard > SQL Editor:
# https://zavatbbdoovnbjuckdtu.supabase.co/project/default/sql

set -e
cd "$(dirname "$0")"
cat ../supabase/schema.sql
