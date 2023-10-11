import React from 'react';
import supabaseClient from '../../utils/supabase';

const CreateLeague = () => {
    const [name, setName] = React.useState('');

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const { data: userData } = await supabaseClient.auth.getUser();
        const { user } = userData;
        if (!user) {
            return;
        }
        const { data, error } = await supabaseClient
            .from('leagues')
            .insert({
                creator_id: user.id,
                name: name,
            }).select();
        if (error) {
            console.error(error);
        }
        console.log("🚀 ~ file: CreateLeague.tsx:22 ~ onSubmit ~ data:", data)
    }

    return (
        <form onSubmit={onSubmit}>
            <label htmlFor="league-name">League Name</label>
            <input id="league-name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <button type="submit">Create</button>
        </form>
    );
};

export default CreateLeague;
