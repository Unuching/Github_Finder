import type { GithubUser } from "../types";

type suggestionsDropdownProps={
    suggestions: GithubUser[];
    show:boolean;
    onSelect: (username:string)=> void

}

const SuggestionDropdown = ({suggestions, show, onSelect}:suggestionsDropdownProps) => {
    if(!show || suggestions.length === 0) return null
    return (  );
}
 
export default SuggestionDropdown;