import React from 'react';

import './PlaceList.css';
import Card from '../../shared/components/UIElements/Card';
import { PlaceType } from '../PlacesType';
import PlaceItem from './PlaceItem';
import Button from '../../shared/components/FormElements/Button';

type Props = {
    items: Array<PlaceType>;
};

const PlaceList = (props: Props) => {
    if (props.items.length === 0) {
        return (
            <div className="place-list center">
                <Card>
                    <h2>No places found. Maybe create one?</h2>
                    <Button to="/place/new">Share Place</Button>
                </Card>
            </div>
        );
    }

    return (
        <ul className="place-list">
            {props.items.map((place) => {
                return (
                    <PlaceItem
                        id={place.id}
                        key={place.id}
                        image={place.imageUrl}
                        title={place.title}
                        description={place.description}
                        address={place.address}
                        creatorId={place.creator}
                        coordinates={place.location}
                    />
                );
            })}
        </ul>
    );
};

export default PlaceList;
