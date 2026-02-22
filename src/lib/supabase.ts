import { createClient } from '@supabase/supabase-js';
import type { Session, User } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Eğer env dosyalarındaki veriler dummy formatında bırakılmışsa otomatik olarak Mock moda geç
const isDemoMode = !url || url.includes('xxxxx') || url.includes('your_supabase_url');

class MockSupabase {
    auth = {
        listeners: new Set<Function>(),

        onAuthStateChange: (callback: any) => {
            this.auth.listeners.add(callback);
            return { data: { subscription: { unsubscribe: () => this.auth.listeners.delete(callback) } } };
        },

        getSession: async () => {
            const sessionStr = localStorage.getItem('mock_session');
            return { data: { session: sessionStr ? JSON.parse(sessionStr) as Session : null }, error: null };
        },

        signInWithPassword: async ({ email, password }: any) => {
            // Admin Credentials
            if (email === 'admin@kaloscope.app' && password === '123456') {
                const dummyUser = { id: 'user-admin-999', email, user_metadata: { full_name: 'Admin Kullanici' }, app_metadata: {}, aud: 'authenticated', created_at: new Date().toISOString() } as User;
                const dummySession = { access_token: 'dummy_admin', refresh_token: 'dummy', expires_in: 3600, token_type: 'bearer', user: dummyUser } as Session;

                localStorage.setItem('mock_session', JSON.stringify(dummySession));
                localStorage.setItem('mock_profile_' + dummyUser.id, JSON.stringify({
                    id: dummyUser.id,
                    email,
                    full_name: 'Admin Kullanici',
                    age: 30,
                    gender: 'male',
                    height_cm: 180,
                    weight_kg: 80,
                    activity_level: 'moderate',
                    goal_type: 'maintain',
                    weekly_goal_kg: 0,
                    daily_calorie_goal: 2500,
                    daily_protein_goal: 150,
                    daily_carb_goal: 300,
                    daily_fat_goal: 80,
                    daily_water_goal: 3000,
                    diet_preference: 'standard',
                    is_pro: true,
                    subscription_tier: 'pro',
                    subscription_end_date: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString(),
                    payment_gateway: 'admin',
                    daily_scans_count: 0,
                    last_scan_date: new Date().toISOString().split('T')[0],
                    onboarding_completed: true,
                    current_streak: 0,
                    longest_streak: 0,
                    last_login_date: new Date().toISOString()
                }));
                this.auth.listeners.forEach(l => l('SIGNED_IN', dummySession));
                return { data: { user: dummyUser, session: dummySession }, error: null };
            }

            // Demo Credentials
            if (email === 'demo@kaloscope.com' && password === '123456') {
                const dummyUser = { id: 'user-demo-123', email, user_metadata: { full_name: 'Demo Kullanıcı' }, app_metadata: {}, aud: 'authenticated', created_at: new Date().toISOString() } as User;
                const dummySession = { access_token: 'dummy', refresh_token: 'dummy', expires_in: 3600, token_type: 'bearer', user: dummyUser } as Session;

                localStorage.setItem('mock_session', JSON.stringify(dummySession));
                localStorage.setItem('mock_profile_' + dummyUser.id, JSON.stringify({
                    id: dummyUser.id,
                    email,
                    full_name: 'Demo Kullanıcı',
                    age: 25,
                    gender: 'male',
                    height_cm: 175,
                    weight_kg: 70,
                    activity_level: 'moderate',
                    goal_type: 'lose',
                    weekly_goal_kg: 0.5,
                    daily_calorie_goal: 2000,
                    daily_protein_goal: 120,
                    daily_carb_goal: 250,
                    daily_fat_goal: 65,
                    daily_water_goal: 2500,
                    diet_preference: 'standard',
                    is_pro: false,
                    subscription_tier: 'free',
                    daily_scans_count: 0,
                    last_scan_date: new Date().toISOString().split('T')[0],
                    onboarding_completed: false,
                    current_streak: 0,
                    longest_streak: 0,
                    last_login_date: new Date().toISOString()
                }));
                this.auth.listeners.forEach(l => l('SIGNED_IN', dummySession));
                return { data: { user: dummyUser, session: dummySession }, error: null };
            }
            return { data: null, error: { message: 'invalid login credentials' } };
        },

        signUp: async ({ email, options }: any) => {
            const dummyUser = { id: 'user-' + Date.now(), email, user_metadata: options?.data || {}, app_metadata: {}, aud: 'authenticated', created_at: new Date().toISOString() } as User;
            const dummySession = { access_token: 'dummy', refresh_token: 'dummy', expires_in: 3600, token_type: 'bearer', user: dummyUser } as Session;

            localStorage.setItem('mock_session', JSON.stringify(dummySession));
            localStorage.setItem('mock_profile_' + dummyUser.id, JSON.stringify({ id: dummyUser.id, email, full_name: options?.data?.full_name }));

            this.auth.listeners.forEach(l => l('SIGNED_IN', dummySession));
            return { data: { user: dummyUser, session: dummySession }, error: null };
        },

        signOut: async () => {
            localStorage.removeItem('mock_session');
            this.auth.listeners.forEach(l => l('SIGNED_OUT', null));
            return { error: null };
        }
    };

    from(table: string) {
        return {
            insert: async (data: any[]) => {
                if (table === 'meals' || table === 'water_logs') {
                    const existingStr = localStorage.getItem(`mock_${table}`) || '[]';
                    let existing = JSON.parse(existingStr);
                    const newItems = data.map(d => ({ ...d, id: 'item-' + Date.now() + Math.random() }));
                    existing = [...newItems, ...existing];
                    localStorage.setItem(`mock_${table}`, JSON.stringify(existing));
                    return { data: newItems, error: null };
                }
                return { data: null, error: null };
            },
            delete: () => ({
                eq: async (col: string, val: string) => {
                    if (table === 'meals' || table === 'water_logs') {
                        const existingStr = localStorage.getItem(`mock_${table}`) || '[]';
                        let existing = JSON.parse(existingStr);
                        existing = existing.filter((m: any) => m[col] !== val);
                        localStorage.setItem(`mock_${table}`, JSON.stringify(existing));
                        return { error: null };
                    }
                    return { error: null };
                }
            }),
            select: (_fields: string) => {
                const chainContext: any = { filters: [] };

                const chainable = {
                    eq: (col: string, val: string) => { chainContext.filters.push({ type: 'eq', col, val }); return chainable; },
                    gte: (col: string, val: string) => { chainContext.filters.push({ type: 'gte', col, val }); return chainable; },
                    lte: (col: string, val: string) => { chainContext.filters.push({ type: 'lte', col, val }); return chainable; },
                    order: (col: string, opts: any) => { chainContext.filters.push({ type: 'order', col, opts }); return chainable; },
                    single: async () => {
                        if (table === 'profiles') {
                            const eqFilter = chainContext.filters.find((f: any) => f.type === 'eq');
                            const val = eqFilter ? eqFilter.val : 'fallback';
                            const profileStr = localStorage.getItem('mock_profile_' + val);
                            const profile = profileStr ? JSON.parse(profileStr) : { id: val, daily_calorie_goal: 2000, onboarding_completed: false };
                            return { data: profile, error: null };
                        }
                        return { data: null, error: null };
                    },
                    then: (resolve: any, reject: any) => {
                        try {
                            if (table === 'meals') {
                                const existingStr = localStorage.getItem('mock_meals') || '[]';
                                let existing = JSON.parse(existingStr);
                                const eqFilter = chainContext.filters.find((f: any) => f.type === 'eq');
                                if (eqFilter) {
                                    existing = existing.filter((m: any) => m[eqFilter.col] === eqFilter.val);
                                }
                                // Return mock immediately
                                resolve({ data: existing, error: null });
                            } else {
                                resolve({ data: [], error: null });
                            }
                        } catch (e) { reject(e); }
                    }
                };
                return chainable as any;
            },
            update: (updates: any) => ({
                eq: (_col: string, val: string) => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            if (table === 'profiles') {
                                const existing = JSON.parse(localStorage.getItem('mock_profile_' + val) || '{}');
                                localStorage.setItem('mock_profile_' + val, JSON.stringify({ ...existing, ...updates }));
                            }
                            resolve({ data: null, error: null });
                        }, 100);
                    });
                }
            })
        };
    }
}

export const supabase: any = isDemoMode ? new MockSupabase() : createClient(url || '', key || '');
