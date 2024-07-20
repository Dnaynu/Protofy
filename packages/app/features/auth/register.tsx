import { FormEvent, useEffect, useRef, useState } from 'react'
import { Button, Input, Paragraph, Spinner, Stack, YStack } from 'tamagui'
import { getEnv, createSessio, PendingResult, getPendingResult } from 'protobase'
import { DefaultLayout } from '../../layout/DefaultLayout'
import Link from 'next/link'
import { ProtofyLogoSVG, Separator, XStack } from '@my/ui'
import { useSearchParams, useRouter } from 'solito/navigation';
import { getErrorMessage, getValidation } from "protolib/dist/lib/error";
import { useSession, useSessionContext } from 'protolib/dist/lib/Session'
import { Auth } from 'protolib/dist/lib/Auth'
import { Center } from 'protolib/dist/components/Center'
import { HorizontalBox } from 'protolib/dist/components/HorizontalBox'
import { Notice } from 'protolib/dist/components/Notice'
import { Section } from 'protolib/dist/components/Section'
import { SpotLight } from 'protolib/dist/components/SpotLight'
import { ElevatedArea } from 'protolib/dist/components/ElevatedArea'
import { BackgroundGradient } from 'protolib/dist/components/BackgroundGradient'
import { Page } from 'protolib/dist/components/Page'
import { LogoIcon } from 'protolib/dist/components/LogoIcon'

export function SignInPage(props) {
  return (
    <Page>
      <DefaultLayout
        title="Protofy"
        description="Made with love from Barcelona"
        footer={null}>
        <YStack f={1} overflow={'hidden'}>
          <Section containerProps={{ f: 1 }} sectionProps={{ index: 0, p: 0 }}>
            <BackgroundGradient />
            <SpotLight t={'20vh'} />
            <Center>
              <Stack mt={'-10vh'}>
                <ElevatedArea>
                  <HorizontalBox>
                    <SignUp />
                  </HorizontalBox>
                </ElevatedArea>
              </Stack>
            </Center>
          </Section>
        </YStack>
      </DefaultLayout>
    </Page>


  )
}

function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [showPasswordInput, setShowPasswordInput] = useState(false)
  const emailRef = useRef(null)
  const [authState, setAuthState] = useState<PendingResult>(getPendingResult('pending'))
  const [session, setSession] = useSession()
  const [sessionContext, setSessionContext] = useSessionContext()
  const router = useRouter()
  const env = getEnv()

  const searchParams = useSearchParams();
  const query = Object.fromEntries(searchParams.entries());
  
  useEffect(() => {
    // @ts-ignore
    emailRef.current?.focus()
  }, [])

  useEffect(() => {
    if (authState.isLoaded && authState.data) {
      const newSession = createSession(authState.data.session.user, authState.data.session.token)
      setSession(newSession)
      setSessionContext(authState.data.context)
    }
  }, [authState])

  useEffect(() => {
    if (session.loggedIn) {
      //@ts-ignore
      router.push(query.return ?? '/');
    }
  }, [session])

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    Auth.register(email, password, rePassword, env, setAuthState)
  }

  return (
    <YStack ai="center" jc="center" p="$2">
      <YStack miw={300} maw={320} jc="space-between" p="$2" gap="$4">
        <YStack mb="$4">
          <LogoIcon o={0.9}>
            <ProtofyLogoSVG
              className="tamagui-icon"
              width={600 / 5}
              height={652 / 5}
            />
          </LogoIcon>
        </YStack>

        {Boolean(authState.isError) && (
          <Notice>
            <Paragraph>{getErrorMessage(authState.error)}</Paragraph>
          </Notice>
        )}

        <>
          <XStack mx="$4" jc="center" space ai="center">
            <Separator />
            <Paragraph size="$2">Create a new account</Paragraph>
            <Separator />
          </XStack>
          <YStack>
            <form onSubmit={handleSignUp}>
              <YStack space="$2" mt={'$5'}>
                <Input
                  id="sign-up-email-input"
                  {...getValidation('username', authState)}
                  ref={emailRef}
                  autoComplete="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.nativeEvent.text)}
                  // @ts-ignore
                  required
                />
                <Input
                  id="sign-up-password-input"
                  {...getValidation('password', authState)}
                  autoComplete="password-new"
                  secureTextEntry
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.nativeEvent.text)}
                  // @ts-ignore
                  required
                />
                <Input
                  id="sign-up-repassword-input"
                  autoComplete="password-new"
                  secureTextEntry
                  placeholder="Repeat Password"
                  value={rePassword}
                  onChange={(e) => setRePassword(e.nativeEvent.text)}
                  // @ts-ignore
                  required
                />
                <Button
                  id="sign-up-btn"
                  // @ts-ignore
                  type="submit"
                  loading={authState.isLoading}
                  disabled={
                    authState.isLoading || !password.length || !rePassword.length || !email.length
                  }
                  mt={"$5"}
                >
                  {session.loggedIn || authState.isLoading ? <Spinner /> : "Sign up"}
                </Button>
              </YStack>
            </form>
          </YStack>
        </>
        <YStack space="$2" >
          <Paragraph theme="alt2" ta="center" size="$2">
            Already registered?
            {` `}
            <Link id="sign-in-link" href="/auth/login" style={{ fontWeight: '800' }}>
              Sign in.
            </Link>
          </Paragraph>
        </YStack>
      </YStack>
    </YStack>
  )
}