import React from 'react';
import Carousel from 'react-material-ui-carousel'
import { Paper, Button, Stack, Item, Box } from '@mui/material'

function LogoCarousal(props) {
    var items = [
        {
            name: "Random Name #1",
            description: "Probably the most random thing you have ever seen!",
            url: "../../../images/logos/Logo-1.png"
        },
        {
            name: "Random Name #2",
            description: "Hello World!",
            url: "../../../images/logos/Logo-2-1.png"
        },
        {
            name: "Random Name #3",
            description: "Hello World!",
            url: "../../../images/logos/Logo-3.png"
        },
        {
            name: "Random Name #4",
            description: "Hello World!",
            url: "../../../images/logos/Logo-4.png"
        },
        {
            name: "Random Name #5",
            description: "Hello World!",
            url: "../../../images/logos/Logo-5.png"
        },
        {
            name: "Random Name #6",
            description: "Hello World!",
            url: "../../../images/logos/Logo-1.png"
        },
        {
            name: "Random Name #7",
            description: "Hello World!",
            url: "../../../images/logos/Logo-2-1.png"
        }
    ]
    const groupSize = 4;
    const result = [];
    for (let i = 0; i < items.length; i += groupSize) {
        const group = items.slice(i, i + groupSize); // Slice the array into groups
        result.push(group);
    }

    return (
        <Carousel
            indicators='false'
            fullHeightHover={false}     // We want the nav buttons wrapper to only be as big as the button element is
            animation="slide"
        >
            {
                result.map((group, i) => <LogoItem key={i} item={group} />)
            }
        </Carousel>
    )
}

function LogoItem(props) {
    return (
        <div>
            <Stack direction="row" spacing={2}>
                {
                    props.item.map((item, i) => (
                        <Box className="log-carousal-box">
                            <img key={i} className="carousal-logo" src={item.url} />
                        </Box>
                    ))
                }
            </Stack>
        </div>
    )
}

export default LogoCarousal