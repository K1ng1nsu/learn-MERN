import React, { useContext, useState } from 'react';

import './PlaceItem.css';
import { CoordinateType } from '../PlacesType';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { ENV } from '../../shared/util/config';

type Props = {
    id: string;
    image: string;
    title: string;
    description: string;
    address: string;
    creatorId: string;
    coordinates: CoordinateType;
    onDelete: (deletePlaceId: string) => void;
};

const PlaceItem = (props: Props) => {
    const auth = useContext(AuthContext);
    const { clearError, error, isLoading, sendRequest } = useHttpClient();

    const [showMap, setShowMap] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const openMapHandler = () => setShowMap(true);
    const closeMapHandler = () => setShowMap(false);

    const openConfirmModalHandler = () => setShowConfirmModal(true);
    const closeConfirmModalHandler = () => setShowConfirmModal(false);
    const confirmDeleteHandler = async () => {
        setShowConfirmModal(false);
        try {
            const responseData = await sendRequest(`/api/places/${props.id}`, 'DELETE', undefined, {
                Authorization: 'Bearer ' + auth.token,
            });
            setShowConfirmModal(false);
            props.onDelete(props.id);
        } catch (error) {}
    };

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            <Modal
                show={showMap}
                onCancel={closeMapHandler}
                header={props.address}
                contentClass="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
            >
                <div className="map-container">
                    <Map className="" center={props.coordinates} zoom={16} />
                </div>
            </Modal>
            <Modal
                show={showConfirmModal}
                onCancel={closeConfirmModalHandler}
                header="Are you sure?"
                footerClass="place-item__modal-actions"
                footer={
                    <>
                        <Button onClick={closeConfirmModalHandler} inverse>
                            CANCEL
                        </Button>
                        <Button onClick={confirmDeleteHandler} danger>
                            DELETE
                        </Button>
                    </>
                }
            >
                <p>Do you want to proceed and delete this place? Please note that it can't be undone thereafter</p>
            </Modal>
            <li className="place-item">
                <Card className="place-item__content">
                    {isLoading && <LoadingSpinner asOverlay />}
                    <div className="place-item__image">
                        <img src={`${ENV.BACK_END_URL}/${props.image}`} alt={props.title} />
                    </div>
                    <div className="place-item__info">
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className="place-item__actions">
                        <Button inverse onClick={openMapHandler}>
                            VIEW ON MAP
                        </Button>
                        {auth.userId === props.creatorId && (
                            <>
                                <Button to={`/place/${props.id}`}>EDIT</Button>
                                <Button danger onClick={openConfirmModalHandler}>
                                    DELETE
                                </Button>
                            </>
                        )}
                    </div>
                </Card>
            </li>
        </>
    );
};

export default PlaceItem;
