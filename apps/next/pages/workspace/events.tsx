import EventsPage from 'protolib/src/bundles/events/adminPages'
import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  useRedirectToEnviron()
  const projectName = SiteConfig.projectName

  return (
    <>
      <Head>
        <title>{projectName + " - Events"}</title>
      </Head>
      <EventsPage.events.component {...props} />
    </>
  )
}

export const getServerSideProps = EventsPage.events.getServerSideProps