import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PlaceType } from '../PlacesType';
import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';

import './PlaceForm.css';
import { useForm } from '../../shared/hooks/form-hook';
import Card from '../../shared/components/UIElements/Card';

const DUMMY_PLACES: Array<PlaceType> = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of most famous sky scrapers in the world!',
        imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipMnGg2AimiTgzaRgCWzYudpdA2Wen7AFk65YVrH=s680-w680-h510',
        address: '20 W 34th St., New York, NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9856644,
        },
        creator: 'u1',
    },
    {
        id: 'p2',
        title: 'Emp. State Building',
        description: 'One of most famous sky scrapers in the world!',
        imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipMnGg2AimiTgzaRgCWzYudpdA2Wen7AFk65YVrH=s680-w680-h510',
        address: '20 W 34th St., New York, NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9856644,
        },
        creator: 'u2',
    },
];

type Props = {};

const UpdatePlace = (props: Props) => {
    const [isLoading, setIsLoading] = useState(true);

    const placeId = useParams().placeId;

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

    const identifiedPlace = DUMMY_PLACES.find((p) => p.id === placeId);

    useEffect(() => {
        setFormData(
            {
                title: {
                    value: identifiedPlace?.title,
                    isValid: true,
                },
                description: {
                    value: identifiedPlace?.description,
                    isValid: true,
                },
            },
            true
        );
        setIsLoading(false);
    }, [setFormData, identifiedPlace]);

    const placeUpdateSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formState.inputs);
    };

    if (!identifiedPlace) {
        return (
            <div className="center">
                <h2>Could not find place!</h2>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="center">
                <Card>
                    <h2>Loading...</h2>
                </Card>
            </div>
        );
    }

    return (
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
    );
};

export default UpdatePlace;
