import { YStack } from 'tamagui'

export const SideMenu = ({sideBarColor='$background', children, ...props}:any) => {
    return <YStack borderWidth={0} backgroundColor={sideBarColor} {...props}>
            <YStack $sm={{display:'none'}} width={260} height="0" flex={1} style={{overflowY:'auto'}}>
                {children}
            </YStack>
    </YStack>
}
