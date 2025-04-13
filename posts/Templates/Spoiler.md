<%* const note = await tp.system.prompt("Enter your text", null, false, false) -%>
{% spoiler %}Beware of <% note.split(/,\s*/g).map(s => `"${s}"`).join(" and ") %> spoilers{% endspoiler %}