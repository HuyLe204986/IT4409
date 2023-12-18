import React from 'react';

const CommentComponent = (props) => {
    const {name, avatar, content, email} = props;
    return (
        <div style={{border: '1px solid #ccc', margin: '16px 0', padding: '12px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <img style={{width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover'}} src={avatar} alt="avatar" />
                <div style={{marginLeft: '8px'}}>{name || email}</div>
            </div>
            <div style={{margin: '16px 0 0 36px'}}>{content}</div>
        </div>
    );
}

export default CommentComponent;
