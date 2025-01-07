import React, { useContext } from 'react';

import './PlaceForm.css';

import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { ENV } from '../../shared/util/config';
import { useNavigate } from 'react-router-dom';

const NewPlace = () => {
    const { isLoading, error, clearError, sendRequest } = useHttpClient();
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

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

    const placeSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await sendRequest(
                `/api/places`,
                'POST',
                JSON.stringify({
                    title: formState.inputs['title'].value,
                    description: formState.inputs['description'].value,
                    address: formState.inputs['address'].value,
                    creator: auth.userId,
                }),
                { 'Content-Type': 'application/json' }
            );
            navigate(`/${auth.userId}/places`);
        } catch (err) {}
        // redirect the user to a diffrent page - if success
    };

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            <form className="place-form" onSubmit={placeSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay />}
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
        </>
    );
};

export default NewPlace;
