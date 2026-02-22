import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const body = await req.json()
        const signature = req.headers.get('paddle-signature')

        // TODO: Verify Paddle signature using PADDLE_WEBHOOK_SECRET

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const eventType = body.event_type
        const userId = body.data.custom_data?.user_id

        if (userId) {
            if (eventType === 'subscription.activated' || eventType === 'subscription.updated') {
                const status = body.data.status
                await supabase
                    .from('profiles')
                    .update({
                        subscription_status: status === 'active' ? 'pro' : 'free',
                        payment_gateway: 'paddle'
                    })
                    .eq('id', userId)
            }

            if (eventType === 'subscription.canceled') {
                await supabase
                    .from('profiles')
                    .update({ subscription_status: 'free' })
                    .eq('id', userId)
            }
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

    } catch (error) {
        console.error('Webhook Error:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
})
