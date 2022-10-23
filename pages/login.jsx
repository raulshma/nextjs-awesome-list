import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { useUser, useSessionContext } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { Container } from '@mantine/core';

const Login = () => {
  const { isLoading, session, error, supabaseClient } = useSessionContext();
  const user = useUser();
  const [data, setData] = useState();

  useEffect(() => {
    async function loadData() {
      const { data } = await supabaseClient.from('test').select('*');
      setData(data);
    }
    // Only run query once user is logged in.
    if (user) loadData();
  }, [user, supabaseClient]);

  if (!user)
    return (
      <>
        {error && <p>{error.message}</p>}
        <Container size="xs" p="lg">
          <Auth
            redirectTo={process.env.NEXT_PUBLIC_APP_URL}
            appearance={{ theme: ThemeSupa }}
            supabaseClient={supabaseClient}
            providers={['google']}
            onlyThirdPartyProviders
            socialLayout="vertical"
          />
        </Container>
      </>
    );

  return (
    <>
      <button onClick={() => supabaseClient.auth.signOut()}>Sign out</button>
      <p>user:</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <p>client-side data fetching with RLS</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
};

export default Login;
