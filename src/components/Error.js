import React from "react";

const Error = ({ errors }) => (
    <pre className="error">
        {errors.map( 
            (error, index) => <div key={index}>{error.message}</div> 
        )}
    </pre>
);

export default Error;
