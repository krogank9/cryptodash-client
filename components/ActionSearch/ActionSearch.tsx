import css from './ActionSearch.module.scss'
import AutosuggestTheme from './Autosuggest.module.scss'
import React from 'react';
import Autosuggest from 'react-autosuggest';
import IonIcon from '../IonIcon/IonIcon';
import getSuggestions from './getSuggestions'
import Utils from '../../Utils'

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.text;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => {setTimeout(function() {/*debugger*/}, 1000); return (
    <div>
        {suggestion.text}
    </div>
)}

const renderInputComponent = inputProps => (
    <div>
        <input type="text" {...Utils.filterDictKeys(inputProps, k => k !== "suggestionsOpen")} />
        <a style={{borderBottomRightRadius: inputProps.suggestionsOpen ? "0" : ""}} >
            <IonIcon name="return-down-forward" />
        </a>
    </div>
)

export default class Example extends React.Component {
    state: {
        value: string,
        suggestions: Array<string>
    }
    constructor(props) {
        super(props)

        this.state = {
            value: '',
            suggestions: []
        }
    }

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    };

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: getSuggestions(value)
        });
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    render() {
        const { value, suggestions } = this.state;

        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder: 'Type an action... "Add 5 BTC"',
            value,
            onChange: this.onChange,
            suggestionsOpen: this.state.suggestions.length > 0
        };

        // Finally, render it!
        return (
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderInputComponent={renderInputComponent}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
                theme={AutosuggestTheme}
            />
        );
    }
}