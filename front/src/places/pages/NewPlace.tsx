import React from 'react';

import './PlaceForm.css';

import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/form-hook';

// type Props = {};

// type FormStateType = {
//     inputs: {
//         [key: string]: {
//             value: string;
//             isValid: boolean;
//         };
//     };
//     isValid: boolean;
// };

// type FormActionType = {
//     type: 'INPUT_CHANGE';
//     inputId: string;
//     isValid: boolean;
//     value: string;
// };

const NewPlace = () => {
    const [formState, inputHandler] = useForm(
        {
            title: {
                value: '',
                isValid: false,
            },
            description: {
                value: '',
                isValid: false,
            },
            address: {
                value: '',
                isValid: false,
            },
        },
        false
    );

    const placeSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log(formState.inputs); // send this to the backend
    };

    return (
        <form className="place-form" onSubmit={placeSubmitHandler}>
            <Input
                id="title"
                type="text"
                element="input"
                label="Title"
                errorText="Please enter a valid title."
                validators={[VALIDATOR_REQUIRE()]}
                onInput={inputHandler}
            />
            <Input
                element="textarea"
                id="description"
                label="Description"
                errorText="Please enter a valid description (at least 5 character)."
                validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
                onInput={inputHandler}
            />
            <Input
                element="input"
                type="text"
                id="address"
                label="Address"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid address."
                onInput={inputHandler}
            />
            <Button type="submit" disabled={!formState.isValid}>
                ADD PLACE
            </Button>
        </form>
    );
};

export default NewPlace;
