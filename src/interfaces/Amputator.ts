export interface AmputatorResponse {
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