import FilesPage from 'protolib/dist/bundles/files/adminPages'
import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib/dist/lib/useRedirectToEnviron'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  useRedirectToEnviron()
  const projectName = SiteConfig.projectName

  return (
    <>
      <Head>
        <title>{projectName + " - Files"}</title>
      </Head>
      <FilesPage.files.component {...props} />
    </>
  )
}

export const getServerSideProps = FilesPage.files.getServerSideProps
