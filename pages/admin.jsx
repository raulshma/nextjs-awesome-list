import { withPageAuth } from '@supabase/auth-helpers-nextjs'

export default function Admin({ user }) {
  console.log(user)
  return <div>Hello {user.email}</div>
}

export const getServerSideProps = withPageAuth({ redirectTo: '/login' })