type Greetprops={
name: string
};
export const Greet=(props:Greetprops)=> {
    return (
<div>
    <h1>Welcome {props.name} </h1>
    <h2>Hello world {props.name} to </h2>
</div>
    );
}