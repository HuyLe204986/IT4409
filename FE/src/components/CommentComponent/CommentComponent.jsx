import React from 'react';

const CommentComponent = (props) => {
    const {name, avatar, content} = props;
    return (
        <>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <img style={{width: '30px', height: '30px', borderRadius: '50%'}} src={avatar} alt="avatar" />
                <div style={{marginLeft: '8px'}}>{name}</div>
            </div>
            <div style={{margin: '16px 0 0 30px'}}>{content}</div>
        </>
    );
}

export default CommentComponent;
