import https from 'https'
/**
 * 
 * @param link The query; (text with) one or more AMP URLs. Must be the last parameter specified.
 * @param gac Whether to use the canonical-finding method guess-and-check. While prone to errors, it's handy as a last resort. It essentially guesses canonical links and tests to see if they could be correct.
 * @param md The maximum number of refferals to canonicals to follow (max-depth). AmputatorBot keeps scraping referred canonical pages untill the max-depth has been reached.
 * @returns retunes a response string
 */
export async function Amputator(link:string[] | string, gac:boolean = true, md: number = 3) {
    let APITarget = `https://www.amputatorbot.com/api/v1/convert?gac=${gac}&md=${md}&q=`,
        resolve = 'de-AMPed Link(s):\n';
    
    if(typeof link != 'string') {
        link.forEach((link)=>{
            APITarget += `${link};`
        })
    }
    (await httpGet(APITarget)).forEach(link => {
        resolve +=`${link.canonical.url}\n`
    })
    return resolve;

}
async function httpGet(apiLink:string) {
    return new Promise<AmputatorResponse[]>(function(resolve, reject) {
        https.get(apiLink, (resp) => {
            let data = '';

            resp.on('data', (chunk) =>{ data += chunk });

            resp.on('end', () => { resolve(JSON.parse(data)) });

        }).on('error', err=> { reject(err) });
    })
}
interface AmputatorResponse {
    "amp_canonical": amputatorSubResponse,
    "canonical": amputatorSubResponse,
    "canonicals":amputatorSubResponse[],
    "origin": {
        "domain": string,
        "is_amp": boolean,
        "is_cached": boolean,
        "is_valid": boolean,
        "url": string,
    },
}
interface amputatorSubResponse {
    "domain": string,
    "is_alt": boolean,
    "is_amp": boolean,
    "is_cached": boolean,
    "is_valid": boolean,
    "type": string,
    "url": string,
    "url_similarity": number
}

