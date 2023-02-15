export default function LoginForm(props) {
    return (
    <form>
        <div>
            <label>Username:</label>
        </div>
        <input type="text" placeholder="Enter username here"></input>
        <div>
            <button>Make new Username</button>
            <button>Get existing team</button>
        </div>
    </form>
    );
}