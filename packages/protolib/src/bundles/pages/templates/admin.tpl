/* @my/ui is wrapper for tamagui. Any component in tamagui can be imported through @my/ui
use result = await API.get(url) or result = await API.post(url, data) to send requests
API.get/API.post will return a PendingResult, with properties like isLoaded, isError and a .data property with the result
if you call paginated apis, you will need to wait for result.isLoaded and look into result.data.items, since result.data is an object with the pagination.
Paginated apis return an object like: {"itemsPerPage": 25, "items": [...], "total": 20, "page": 0, "pages": 1}
*/

import { Protofy, API } from 'protobase'
import { PaginatedDataSSR } from 'protolib/dist/lib/SSR'
import { useWorkspaceUrl, getWorkspaceApiUrl } from 'protolib/dist/lib/useWorkspaceEnv'
import { useRedirectToEnviron } from 'protolib/dist/lib/useRedirectToEnviron'
import { Objects } from 'app/bundles/objects'
import { DataView } from 'protolib/dist/components/DataView'
import { AdminPage } from 'app/layout/AdminPage'
import { Tag } from '@tamagui/lucide-icons'
import { context } from 'app/bundles/uiContext'
import { useRouter } from 'solito/navigation'

const Icons =  {}
const isProtected = Protofy("protected", {{protected}})
const {name, prefix} = Objects.{{rawObject}}.getApiOptions()
const apiUrl = prefix + name

Protofy("object", "{{_object}}")
Protofy("pageType", "admin")

export default {
    route: Protofy("route", "{{route}}"),
    component: ({pageState, initialItems, pageSession, extraData}:any) => {
        useRedirectToEnviron()
        const getWorkspaceUrl = useWorkspaceUrl()

        return (<AdminPage title="{{object}}" pageSession={pageSession}>
            <DataView
                URLTransform={getWorkspaceUrl}
                rowIcon={Tag}
                sourceUrl={apiUrl}
                initialItems={initialItems}
                numColumnsForm={1}
                name="{{object}}"
                model={Objects.{{rawObject}} } 
                pageState={pageState}
                icons={Icons}
            />
        </AdminPage>)
    }, 
    getServerSideProps: (context) => PaginatedDataSSR(getWorkspaceApiUrl(context.resolvedUrl, apiUrl), isProtected?Protofy("permissions", {{{permissions}}}):undefined)(context)
}