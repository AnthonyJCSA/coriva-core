import { supabase, isSupabaseConfigured } from '../supabase'
import { User, Organization } from '@/types'

export const authService = {
  async login(username: string, password: string): Promise<{ user: User; org: Organization } | null> {
    if (!isSupabaseConfigured()) return null

    const { data: users, error } = await supabase
      .from('corivacore_users')
      .select('*, org:corivacore_organizations(*)')
      .eq('username', username)
      .eq('is_active', true)
      .single()

    if (error || !users) return null

    // En producción, verificar password_hash con bcrypt
    // Por ahora, comparación simple (SOLO PARA DEMO)
    if (users.password_hash !== password) return null

    const user: User = {
      id: users.id,
      organization_id: users.org_id,
      username: users.username,
      email: users.email,
      full_name: users.full_name,
      role: users.role,
      is_active: users.is_active,
      created_at: users.created_at
    }

    const org: Organization = {
      id: users.org.id,
      name: users.org.name,
      slug: users.org.slug,
      business_type: users.org.business_type,
      ruc: users.org.ruc,
      address: users.org.address,
      phone: users.org.phone,
      email: users.org.email,
      logo_url: users.org.logo_url,
      settings: users.org.settings,
      is_active: users.org.is_active,
      created_at: users.org.created_at,
      updated_at: users.org.updated_at
    }

    return { user, org }
  },

  async getOrganization(orgId: string): Promise<Organization | null> {
    if (!isSupabaseConfigured()) return null

    const { data, error } = await supabase
      .from('corivacore_organizations')
      .select('*')
      .eq('id', orgId)
      .single()

    if (error || !data) return null

    return data as Organization
  }
}
