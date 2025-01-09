import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PlaceType } from '../PlacesType';
import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';

import './PlaceForm.css';
import { useForm } from '../../shared/hooks/form-hook';
import Card from '../../shared/components/UIElements/Card';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';

type Props = {};

const UpdatePlace = (props: Props) => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [loadedPlace, setLoadedPlace] = useState();
    const [formState, inputHandler, setFormData] = useForm(
        {
            title: {
                value: '',
                isValid: false,
            },
            description: {
                value: '',
                isValid: false,
            },
        },
        false
    );

    const { clearError, error, isLoading, sendRequest } = useHttpClient();
    const placeId = useParams().placeId;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseData = await sendRequest(`/api/places/${placeId}`);
                setLoadedPlace(responseData.place);
                setFormData(
                    {
                        title: {
                            value: responseData.place.title,
                            isValid: true,
                        },
                        description: {
                            value: responseData.place.description,
                            isValid: true,
                        },
                    },
                    true
                );
            } catch (error) {}
        };

        fetchData();
    }, [sendRequest, placeId, setFormData]);

    const placeUpdateSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const responseData = await sendRequest(
                `/api/places/${placeId}`,
                'PATCH',
                JSON.stringify({
                    title: formState.inputs['title'].value,
                    description: formState.inputs['description'].value,
                }),
                { 'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.token }
            );

            console.log(responseData);

            navigate(`/${responseData.place.creator}/places`);
        } catch (error) {}
    };

    if (isLoading) {
        return (
            <div className="center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!loadedPlace && !error) {
        return (
            <div className="center">
                <h2>Could not find place!</h2>
            </div>
        );
    }

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
                <Input
                    id="title"
                    element="input"
                    type="text"
                    label="Title"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title."
                    onInput={inputHandler}
                    initialValue={formState.inputs['title'].value}
                    initialValid={formState.inputs['title'].isValid}
                />
                <Input
                    id="description"
                    element="textarea"
                    label="Description"
                    validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid description (at least 5 characters)."
                    onInput={inputHandler}
                    initialValue={formState.inputs['description'].value}
                    initialValid={formState.inputs['description'].isValid}
                />
                <Button type="submit" disabled={!formState.isValid}>
                    UPDATE PLACE
                </Button>
            </form>
        </>
    );
};

export default UpdatePlace;
