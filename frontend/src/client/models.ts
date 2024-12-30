export type Body_login_login_access_token = {
  grant_type?: string | null
  username: string
  password: string
  scope?: string
  client_id?: string | null
  client_secret?: string | null
}

export type Body_login_social = {
  email: string
  firstname?: string
  lastname?: string
  password: string
}

export type HTTPValidationError = {
  detail?: Array<ValidationError>
}

export type ItemCreate = {
  title: string
  description?: string | null
}

export type ItemPublic = {
  title: string
  description?: string | null
  id: string
  owner_id: string
}

export type ItemUpdate = {
  title?: string | null
  description?: string | null
}

export type ItemsPublic = {
  data: Array<ItemPublic>
  count: number
}

export type Message = {
  message: string
}

export type NewPassword = {
  token: string
  new_password: string
}

export type Token = {
  access_token: string
  token_type?: string
}

export type UpdatePassword = {
  current_password: string
  new_password: string
}

export type UserCreate = {
  email: string
  is_active?: boolean
  is_superuser?: boolean
  first_name?: string | null
  last_name?: string | null
  password: string
}

export type UserPublic = {
  email: string
  is_active?: boolean
  is_superuser?: boolean
  first_name?: string | null
  last_name?: string | null
  id: string
}

export type UserRegister = {
  email: string
  password: string
  first_name?: string | null
  last_name?: string | null
}

export type UserUpdate = {
  email?: string | null
  is_active?: boolean
  is_superuser?: boolean
  first_name?: string | null
  last_name?: string | null
  password?: string | null
}

export type UserUpdateMe = {
  first_name?: string | null
  last_name?: string | null
  email?: string | null
}

export type UsersPublic = {
  data: Array<UserPublic>
  count: number
}

export type ValidationError = {
  loc: Array<string | number>
  msg: string
  type: string
}

export type DraftCreate = {
  title: string
  content: string
  scheduled_time?: Date
}

export type DraftUpdate = {
  title?: string | null
  content?: string | null
  scheduled_time?: Date | null
}

export type DraftPublish = {
  id: string
}

export type DraftPublic = {
  id?: string
  title: string
  content: string
  image_url: string
  link_url: string
  platform: string
  is_published: string
  scheduled_time?: string
  created_at?: string
}

export type DraftsPublic = {
  data: Array<DraftPublic>
  count: number
}

export type SocialPlatform = "instagram" | "facebook" | "twitter"

export interface Post {
  id: string
  title: string
  content: string
  image?: string
  platforms: SocialPlatform[]
  status: "draft" | "published"
  scheduled_time?: Date
  createdAt: Date
  updatedAt: Date
}
