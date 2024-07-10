import FSMPages from 'protolib/src/bundles/fsm/adminPages'
import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  useRedirectToEnviron()
  const projectName = SiteConfig.projectName

  return (
    <>
      <Head>
        <title>{projectName + " - State Machines"}</title>
      </Head>
      <FSMPages.fsm.component {...props} />
    </>
  )
}

export const getServerSideProps = FSMPages.fsm.getServerSideProps