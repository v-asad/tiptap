import { DEFAULT_THEME } from "@/lib/themes";

export const CatsTemplate = {
  theme: DEFAULT_THEME,
  slides: [
    {
      id: crypto.randomUUID(),
      content: `
        <h1 textAlign="center">Cats</h1>
        <p textAlign="center">The fascinating world of cats</p>
        <p textAlign="center">Discover their unique behaviours, breeds, and care tips in this presentation.</p>
        `,
    },
    {
      id: crypto.randomUUID(),
      content: `
        <h2 textAlign="left">Introduction</h2>
        <row columnWidths="1,1">
            <column>
                <p textAlign="left">Cats are among the most beloved pets around the world. They have been companions to humans for thousands of years.</p>
                <p textAlign="left">Their mysterious behaviors and playful nature make them endlessly fascinating.</p>
            </column>
            <column>
                <p textAlign="left">Cats are natural hunters, agile climbers, and can adapt to various environments.</p>
                <p textAlign="left">Their purring, stretching, and curious personalities make them ideal pets for families and individuals alike.</p>
            </column>
        </row>
        `,
    },
    {
      id: crypto.randomUUID(),
      content: `
        <h2 textAlign="center">Popular Cat Breeds</h2>
        <row columnWidths="1,1,1">
            <column>
                <p textAlign="center"><strong>Siamese:</strong> Sleek, vocal, and affectionate cats with striking blue eyes.</p>
                <image src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages2.alphacoders.com%2F913%2F913448.jpg&f=1&nofb=1&ipt=065ad965e44689ef4f84697c323b7e79d09d4cbb97d5fd4926faec8131b9b47a" alt="Siamese Cat" layout="default" size=""></image>
            </column>
            <column>
                <p textAlign="center"><strong>Maine Coon:</strong> Large, gentle, and friendly cats with long, fluffy fur.</p>
                <image src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.pexels.com%2Fphotos%2F17006168%2Fpexels-photo-17006168.jpeg%3Fcs%3Dsrgb%26dl%3Dpexels-rodion-kutsaiev-17006168.jpg%26fm%3Djpg&f=1&nofb=1&ipt=ceb2ccc6c6d431d14ec3fcd30b0afba797c55c816ac1014a80878024c2ac918d" alt="Maine Coon Cat" layout="default" size=""></image>
            </column>
            <column>
                <p textAlign="center"><strong>Persian:</strong> Calm and luxurious long-haired cats known for their beautiful coats.</p>
                <image src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ffishsubsidy.org%2Fwp-content%2Fuploads%2F2020%2F02%2Fpersian-cat1.jpg&f=1&nofb=1&ipt=5106c69134d4a1721e6dce0b3ad9dfb1c83d37ee922e3d0d7fad81c3e4511de9" alt="Persian Cat" layout="default" size=""></image>
            </column>
        </row>
        `,
    },
    {
      id: crypto.randomUUID(),
      content: `
        <h2 textAlign="left">Cat Traits</h2>
        <ul>
            <li>
                <p textAlign="left">Independent and self-reliant</p>
            </li>
            <li>
                <p textAlign="left">Agile, graceful, and playful</p>
            </li>
            <li>
                <p textAlign="left">Curious and intelligent</p>
            </li>
            <li>
                <p textAlign="left">Affectionate and loyal to their owners</p>
            </li>
            <li>
                <p textAlign="left">Communicate with a variety of vocalizations and body language</p>
            </li>
        </ul>
        <p textAlign="left">These traits make cats versatile companions for many different lifestyles.</p>
        `,
    },
    {
      id: crypto.randomUUID(),
      content: `
        <h2 textAlign="left">Diet and Nutrition</h2>
        <row columnWidths="1.25,0.75">
            <column>
                <p textAlign="left">Cats are obligate carnivores, meaning they require meat to survive.</p>
                <p textAlign="left">High-quality protein is essential for healthy muscles and organs.</p>
            </column>
            <column>
                <p textAlign="left">They also require certain vitamins and taurine, which are naturally found in meat.</p>
                <p textAlign="left">Always provide fresh water and avoid feeding them dog food or excessive treats.</p>
            </column>
        </row>
        `,
    },
    {
      id: crypto.randomUUID(),
      content: `
        <h2 textAlign="center">Fun Facts</h2>
        <row columnWidths="1,1,1">
            <column>
                <p textAlign="center">Cats can make over 100 different vocal sounds.</p>
            </column>
            <column>
                <p textAlign="center">A cat can sleep 12–16 hours a day, sometimes up to 20 hours for kittens.</p>
            </column>
            <column>
                <p textAlign="center">Whiskers help cats sense the width of spaces and detect movement.</p>
            </column>
        </row>
        <p textAlign="center">Cats’ unique behaviors make them both fun and mysterious companions.</p>
        `,
    },
    {
      id: crypto.randomUUID(),
      content: `
        <h2 textAlign="center">Conclusion</h2>
        <image src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ffishsubsidy.org%2Fwp-content%2Fuploads%2F2020%2F02%2Fpersian-cat1.jpg&f=1&nofb=1&ipt=5106c69134d4a1721e6dce0b3ad9dfb1c83d37ee922e3d0d7fad81c3e4511de9" alt="Persian Cat" layout="full-left" size="60"></image>
        <p textAlign="center">Cats bring joy, companionship, and fascination to millions of homes around the world.</p>
        <p textAlign="center">From playful antics to quiet moments, cats enrich our lives in countless ways.</p>
        <p textAlign="center">Thank you for exploring the amazing world of cats!</p>
        `,
    },
  ],
};
