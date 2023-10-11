import { useLoaderData } from "react-router-dom";
import supabaseClient from "../../utils/supabase";

export async function loader() {
    const { data, error } = await supabaseClient.from('leagues').select();
    if (error) return console.error(error);
    return { leagues: data };
}

const List = () => {
    const { leagues } = useLoaderData() as { leagues: Array<{ id: number, name: string }> };
    return (
        <ul>
            {leagues.map((league) => (
                <li key={league.id}>{league.name}</li>
            ))}
        </ul>
    );
};

export default List;
