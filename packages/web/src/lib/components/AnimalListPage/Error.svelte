<script lang="ts">
import type { PostgrestError } from "@supabase/supabase-js";

export let value: PostgrestError;
</script>

<div style:color="orange">{JSON.stringify(value)}</div>
