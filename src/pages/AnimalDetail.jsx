import React from 'react';
import { Tag, Carousel, Descriptions, Card } from 'antd';
import { useParams } from 'react-router-dom';
import animalData from '../store/animal_data.json';

const AnimalDetail = () => {
    const { uuid } = useParams(); // Get the UUID from the URL parameters

    // Find the animal by UUID in the animal data
    const animal = animalData.parks.flatMap(park => park.animals).find(a => a.uuid === uuid);

    if (!animal) {
        return <div className="mt-20">Animal not found.</div>;
    }

    return (
        <div className="p-5">
            <h1 className="text-3xl font-bold mb-4">{animal.name}</h1>

            {/* Carousel for Main and Additional Images */}


            {/* Descriptions for Structured Information */}
            <Card className="mt-5">
                <Descriptions title="Информация о животном" bordered column={1}>
                    <Descriptions.Item label="Описание">{animal.description}</Descriptions.Item>
                    <Descriptions.Item label="Среда обитания">{animal.habitat}</Descriptions.Item>
                    <Descriptions.Item label="Рацион">{animal.diet}</Descriptions.Item>
                    <Descriptions.Item label="Статус сохранения">{animal.conservationStatus}</Descriptions.Item>
                    <Descriptions.Item label="Степень редкости">{animal.rarityLevel}</Descriptions.Item>
                    <Descriptions.Item label="Угрозы">{animal.threats}</Descriptions.Item>
                    <Descriptions.Item label="Забавный факт">{animal.funFact}</Descriptions.Item>
                    <Descriptions.Item label="UUID">
                        <span style={{ fontWeight: 'bold', color: 'red' }}>{animal.uuid}</span>
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {/* Tags for Animal */}
            <Card className="mt-5">
                <h2 className="text-2xl mb-3">Теги</h2>
                <div>
                    {animal.tags.map((tag, index) => (
                        <Tag key={index} color="blue">{tag}</Tag>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default AnimalDetail;
