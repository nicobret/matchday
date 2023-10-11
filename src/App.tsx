import './index.css'
import { useEffect } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import supabaseClient from './utils/supabase'
import useStore from './utils/zustand'

export default function App() {
  const { session, setSession } = useStore()

  async function getSession() {
    const res = await supabaseClient.auth.getSession();
    if (res.error) console.error(res.error);
    if (!res.data.session) return;
    setSession(res.data.session);
  }

  async function logout() {
    await supabaseClient.auth.signOut()
    setSession(null)
  }

  useEffect(() => {
    getSession()
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => { setSession(session) })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <>
      <header>
        <h1>
          Matchday
        </h1>

        <nav>
          <ul>
            <li><Link to="/leagues">Ligues</Link></li>
            <li><Link to="/games">Matches</Link></li>
            <li><Link to="/players">Joueurs</Link></li>
          </ul>
        </nav>

        {session ? <div><p>{session.user.email}</p><button onClick={logout}>Déconnexion</button>
        </div> : <Auth supabaseClient={supabaseClient} appearance={{ theme: ThemeSupa }} providers={[]} />}
      </header>

      <Outlet />
    </>
  )
}