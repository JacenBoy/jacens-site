<%* const chatName = await tp.system.prompt("Name", null, false, false);
const chatRole = await tp.system.suggester(["Sender", "Recipient"], ["snd", "rec"]);
const chatContent = await tp.system.prompt("Chat content", null, false, true);
-%>
{% chatmsg "<% chatName %>", "<% chatRole %>" %}<% chatContent %>{% endchatmsg %}