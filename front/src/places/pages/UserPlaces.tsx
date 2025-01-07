import React, { useEffect, useState } from 'react';
import PlaceList from '../components/PlaceList';
import { PlaceType } from '../PlacesType';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { ENV } from '../../shared/util/config';

type Props = {};

const UserPlaces = (props: Props) => {
    const { clearError, error, isLoading, sendRequest } = useHttpClient();
    const [loadedPlaces, setLoadedPlaces] = useState<PlaceType[]>([]);

    const userId = useParams().userId;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseData = await sendRequest(`/api/places/user/${userId}`);

                setLoadedPlaces(responseData.places);
            } catch (err) {}
        };

        fetchData();
    }, [sendRequest, userId]);

    const placeDeleteHandler = (deletePlaceId: string) => {
        setLoadedPlaces((prevPlaces) => prevPlaces.filter((prevPlace) => prevPlace.id !== deletePlaceId));
    };

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && <PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler} />}
        </>
    );
};

export default UserPlaces;
