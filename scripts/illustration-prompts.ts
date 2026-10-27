// Per-illustration prompt suffixes. The locked style prefix lives in
// scripts/style-prompt.md and is prepended at generation time.

export const illustrationPrompts: Record<string, string> = {
  // Covers
  'cat.cover':
    'A peaceful close up of Mia kneeling in tall sage grass, gently petting the small orange tabby kitten. Soft golden afternoon light. Wide cream sky.',
  'dog.cover':
    'Mia walking on a soft path in a dappled park with the medium fluffy brown dog beside her, both looking happy and calm.',
  'roar.cover':
    'Mia sitting cross legged on a rug, holding an open picture book with the tiny friendly green dinosaur peeking over the page edge.',

  // Cat scenes
  'cat.s1':
    'Mia stands in a sunlit garden holding her sage green stuffed rabbit, looking off to one side with curiosity. Generous cream sky and soft sage grass.',
  'cat.s2':
    'A small orange tabby kitten peeks out from behind a slim tree trunk, only its head and one paw visible, looking warmly toward the viewer.',
  'cat.s3a':
    'Mia waves softly with one open hand. The orange kitten watches calmly with its head tilted, half a step closer.',
  'cat.s3b':
    'Mia sits cross legged in the grass, very still and quiet. The orange kitten tip toes carefully toward her on light feet.',
  'cat.s3c':
    'Mia kneels in the grass calling softly with cupped hands near her mouth. The orange kitten trots over with ears perked.',
  'cat.s4':
    'Mia and the orange kitten sit side by side in the soft grass, looking at each other. Warm afternoon light.',
  'cat.s5':
    'Mia kneels with her sage green stuffed rabbit in one hand and her other hand outstretched, the orange kitten looking curiously at both.',
  'cat.s6a':
    'The orange kitten leans forward to gently sniff the sage green stuffed rabbit. Mia smiles softly.',
  'cat.s6b':
    'Mia gently pets the orange kitten on the back. The kitten has its eyes closed in contentment.',
  'cat.s7':
    'Mia and the orange kitten crouched playfully together in soft sage grass, both leaning forward ready to dash, pigtails and ears lifting with excitement, bright happy energy. Warm afternoon light.',
  'cat.s8':
    'Mia sitting in soft sage grass at golden hour with the orange kitten nestled contentedly against her side, both peaceful and happy together. Wide warm cream sky.',
  'cat.expression':
    'Close up of the orange kitten with a small warm smile and slightly tilted head, eyes half closed in a friendly soft expression.',

  // Dog scenes
  'dog.s1':
    'Mia stands at the start of a soft park path, holding her sage green stuffed rabbit, looking down the path with anticipation. Soft trees on either side.',
  'dog.s2':
    'A medium fluffy brown dog sits in front of Mia with a happy expression, tail mid wag, looking up at her warmly.',
  'dog.s3a':
    'Mia and the brown dog run side by side across soft sage grass, both clearly delighted, motion implied with gentle hair lift.',
  'dog.s3b':
    'Mia mid throw of a small stick. The brown dog leaps forward in a soft graceful arc to catch it.',
  'dog.s3c':
    'Mia kneels and gently pets the brown dog on the head. The dog leans into her hand, eyes softly closed.',
  'dog.s4':
    'Mia and the brown dog sit close together on the grass, both looking content and relaxed. Soft late afternoon sky behind them.',
  'dog.s5':
    'A path on soft grass branches in two directions. To the left, a wooden bench sits under a small tree. To the right, the path continues onward.',
  'dog.s6a':
    'Mia sits on a wooden park bench. The brown dog rests its head softly on her knee. Warm quiet evening light.',
  'dog.s6b':
    'Mia and the brown dog walk along a soft path through dappled shade, the dog close beside her.',
  'dog.expression':
    'Close up of the brown dog with a wide soft smile, tongue just slightly out, eyes warm and squinted in joy.',

  // Roar scenes
  'roar.s1':
    'Mia sits on a soft round rug with an open picture book on her lap. A small lamp throws warm light. The corner of the page glows faintly as something starts to emerge.',
  'roar.s2':
    'The tiny green dinosaur stands on the rug in front of Mia, looking up at her happily with its mouth wide open as if about to make a sound.',
  'roar.s3a':
    'The tiny green dinosaur with mouth open mid roar. Tiny soft motion lines around its head suggest a small squeaky sound.',
  'roar.s3b':
    'The tiny green dinosaur grins up at Mia with a big shy smile, leaning slightly forward.',
  'roar.s3c':
    'The tiny green dinosaur waves both tiny arms cheerfully at Mia.',
  'roar.s4':
    'Mia and the tiny green dinosaur side by side on the rug, both with happy expressions, looking at each other.',
  'roar.s5':
    'A cozy room with soft sage walls. The picture book lies open on the rug. Warm lamp light. Empty floor space invites play.',
  'roar.s6a':
    'Mia and the tiny green dinosaur run in a small circle around the rug, both clearly mid laughter.',
  'roar.s6b':
    'Mia and the tiny green dinosaur sit close together on the rug, both looking down at the open picture book. Warm lamp light.',
  'roar.expression':
    'Close up of the tiny green dinosaur with a wide warm grin, eyes squinted in joy.',

  // Choice option illustrations (small icons, isolated subjects on cream)
  'choice.wave':
    'A single small open hand mid wave gesture, isolated centered on a soft cream background.',
  'choice.sit':
    'A small simple silhouette of a child sitting cross legged, isolated centered on a soft cream background.',
  'choice.call':
    'A small simple illustration of two hands cupped softly near a mouth, isolated centered on a soft cream background.',
  'choice.run':
    'A small simple illustration of a child running, isolated centered on a soft cream background.',
  'choice.play':
    'A small simple illustration of a soft ball, isolated centered on a soft cream background.',
  'choice.pet':
    'A small simple illustration of a single open hand softly patting downward, isolated centered on a soft cream background.',
  'choice.walk':
    'A small simple illustration of a winding garden path, isolated centered on a soft cream background.',
  'choice.toy':
    'A small simple illustration of a sage green stuffed rabbit with cream ears, isolated centered on a soft cream background.',
  'choice.roar':
    'A small simple illustration of an open mouth with tiny motion lines suggesting a roar, isolated centered on a soft cream background.',
  'choice.smile':
    'A small simple illustration of a wide warm smile shape, isolated centered on a soft cream background.',
  'choice.read':
    'A small simple illustration of an open book with two soft pages, isolated centered on a soft cream background.',

  // ---- Module 1 · Pat the Cat (short A) ----
  'pat.s1':
    'Mia kneeling in a soft cool-morning garden beside the orange tabby cat, the cat tucked up small and a little shivery. Gentle muted light.',
  'pat.s2':
    'The small orange tabby cat looking up hopefully, a cozy knit hat and a soft fuzzy mat resting on the grass nearby.',
  'pat.s3a':
    'The orange tabby cat wearing a too-big floppy knit hat that slides down over its eyes, Mia giggling beside it.',
  'pat.s3b': 'The orange tabby cat settling happily onto a soft fuzzy woven mat.',
  'pat.s4':
    'Mia gently patting the cozy orange tabby cat, the cat purring with eyes half closed, soft and content.',
  'pat.s5': 'The snug orange tabby cat curled up cozy and warm, blinking sleepy and content.',
  'pat.s6': 'Mia and the purring orange tabby cat cuddled close together in a cozy garden.',

  // ---- Module 1 · The Big Pig (short I) ----
  'pig.s1':
    'Mia in dusty blue overalls peering with worry at a ball sunk deep in a squishy brown mud patch, soft reeds around.',
  'pig.s2':
    'A big happy round pink pig standing beside a mud puddle, ready to help, Mia watching hopefully.',
  'pig.s3a': 'The round pink pig standing tall and proud, chest puffed out, looking strong and happy.',
  'pig.s3b':
    'The round pink pig digging into the soft brown mud with its snout, little mud splats flying.',
  'pig.s4':
    'The muddy round pink pig holding up the rescued ball with a big muddy grin, Mia cheering.',
  'pig.s5': 'The happy muddy pink pig flopping down to sit and rest in soft green grass.',
  'pig.s6': 'Mia hugging the muddy round pink pig, both smiling, warm afternoon light.',

  // ---- Module 1 word icons (reused as choice + spell celebration) ----
  'choice.hat': 'A small simple cozy knit hat, isolated centered on a soft cream background.',
  'choice.mat': 'A small simple soft woven mat, isolated centered on a soft cream background.',
  'choice.pat':
    'A small simple single open hand giving a gentle downward pat, isolated centered on a soft cream background.',
  'choice.big':
    'A small simple round pink pig standing tall and looking big and strong, isolated centered on a soft cream background.',
  'choice.dig':
    'A small simple little mound of brown dirt with a digging motion, isolated centered on a soft cream background.',
  'choice.pig':
    'A small simple round happy pink pig, isolated centered on a soft cream background.',

  // ---- Module 1 · Fan the Cat (short A · -an) ----
  'fan.s1':
    'Mia and the orange tabby cat in sunny grass on a hot day, the cat flopped flat in the heat, bright warm light.',
  'fan.s2':
    'The panting orange tabby cat, a paper hand fan and a little watering can resting on the grass nearby.',
  'fan.s3a': 'Mia waving a big paper fan at the orange cat, the cat’s fur gently ruffling.',
  'fan.s3b': 'Mia tipping a little watering can for the orange cat to take a cool sip.',
  'fan.s4': 'The cooled-off orange tabby cat sitting up bright and happy, then zooming off across the grass.',
  'fan.s5': 'The cool happy orange cat back in its little knit hat, ready to play.',
  'fan.s6': 'Mia and the cool happy orange cat snuggled together in soft shade.',

  // ---- Module 1 · The Dog and the Log (short O) ----
  'doglog.s1':
    'A big fallen log across a grassy path, the fluffy brown dog on one side and a worried pink pig stuck on the far side.',
  'doglog.s2':
    'The goofy fluffy brown dog wiggling happily by the low end of the log, ready to show the shy pig what to do.',
  'doglog.s3a': 'The brown dog patting the low end of the fallen log with a paw, pointing the way up.',
  'doglog.s3b': 'The fluffy brown dog doing a big goofy hop with ears flopping, the pink pig giggling.',
  'doglog.s4': 'The pink pig hopping over the log while the fluffy brown dog cheers with a wide happy grin.',
  'doglog.s5': 'The happy pink pig landing safely on the other side, Mia and the dog clapping.',
  'doglog.s6': 'Mia, the fluffy brown dog, and the pink pig all together on the same side in a warm hug.',

  // ---- More Module 1 word icons ----
  // Map scenes (unit 4)
  'map.s1':
    'Mia crouched in the doorway of a small garden shed, unrolling an old crinkled treasure map, the orange tabby cat peering over her arm. Warm dusty light.',
  'map.s2':
    'A soft sunlit patch of grass with a little sun cap and a small watering can resting side by side, ready to be picked up.',
  'map.s3a':
    'Mia pulling a soft sun cap onto her head with both hands, grinning, the orange tabby cat waiting beside her.',
  'map.s3b':
    'Mia tucking a little watering can under one arm, ready to set off, the orange tabby cat trotting alongside.',
  'map.s4':
    'Mia and the orange tabby cat at a big red X marked in soft dirt, the cat patting the ground with one paw.',
  'map.s5':
    'Mia lifting a small dented tin out of the soft dirt, seeds spilling from the open lid, the orange cat leaning in curiously. Bright happy light.',
  'map.s6':
    'Mia and the orange tabby cat sitting together in the grass, a small pile of seeds shared between them. Warm golden afternoon light.',

  'choice.cap': 'A small simple soft sun cap, isolated centered on a soft cream background.',
  'choice.tap':
    'A small simple single cat paw patting downward on soft ground, isolated centered on a soft cream background.',
  'choice.map':
    'A small simple rolled open treasure map with a red X, isolated centered on a soft cream background.',

  // The New Friend scenes (unit 5, short A spiral)
  'pat2.s1':
    'Mia and the orange tabby cat sitting close together on a soft woven mat in the sunny garden, relaxed and cozy.',
  'pat2.s2':
    'A simple wooden garden gate seen from inside the garden, something small waiting just beyond it, soft curious mood.',
  'pat2.s3a':
    'A tiny friendly grey bat with soft rounded wings fluttering gently down into the garden, Mia and the orange cat looking up in delight.',
  'pat2.s3b':
    'A small friendly grey mouse-like rat with round ears popping out beside the garden gate, Mia and the orange cat leaning in warmly.',
  'pat2.s4':
    'The orange tabby cat shuffling over to make room on the woven mat as the small new friend settles down beside it, Mia smiling.',
  'pat2.s5':
    'The orange tabby cat gently placing its floppy knit hat onto the small new friend, both looking pleased.',
  'pat2.s6':
    'Mia, the orange tabby cat and the small new friend all sitting together on one little woven mat in warm golden light.',

  'choice.bat':
    'A small simple friendly grey bat with soft rounded wings, isolated centered on a soft cream background.',
  'choice.rat':
    'A small simple friendly grey rat with round ears and a soft tail, isolated centered on a soft cream background.',
  'choice.sat':
    'A small simple silhouette of a cat sitting neatly with its tail curled, isolated centered on a soft cream background.',

  // Win a Pin scenes (unit 7)
  'pin.s1':
    'A sunny garden set up for a games day with bunting strung between two trees, Mia and the round pink pig looking excited. A small shiny badge sits on a little wooden post.',
  'pin.s2':
    'A garden with two games side by side: a shallow water trough with a little wooden fish in it, and a ring toss post with a shiny badge on top.',
  'pin.s3a':
    'Mia and the round pink pig kneeling at a shallow water trough, splashing a little wooden fish with a red fin along the water, both laughing.',
  'pin.s3b':
    'Mia mid throw of a soft rope ring toward a wooden post with a shiny badge on top, the round pink pig watching keenly.',
  'pin.s4':
    'Mia and the round pink pig crossing a chalk finish line at exactly the same moment, both mid stride and delighted, bunting overhead.',
  'pin.s5':
    'The round pink pig gently pinning a small shiny badge onto Mia\'s pinafore, both looking pleased.',
  'pin.s6':
    'Mia and the round pink pig sitting together on the grass under the bunting, one shiny badge between them. Warm golden light.',

  'choice.fin':
    'A small simple little wooden toy fish with a red fin, isolated centered on a soft cream background.',
  'choice.pin':
    'A small simple shiny round prize badge with a pin, isolated centered on a soft cream background.',
  'choice.win':
    'A small simple chalk finish line with a tiny bunting flag, isolated centered on a soft cream background.',

  // A Bit More Room scenes (unit 8)
  'bit.s1':
    'Mia crouched in the grass building a small den out of old wooden boards leaning together, tools beside her.',
  'bit.s2':
    'A half built little wooden den in the grass, a wooden mallet and peg resting on one side and a loose board on the other.',
  'bit.s3a':
    'Mia tapping a wooden peg into the ground with a small wooden mallet, the round pink pig watching closely.',
  'bit.s3b':
    'Mia pushing a wooden board into place so the little den slots together, the round pink pig nudging it with her snout.',
  'bit.s4':
    'The round pink pig squeezing into a small wooden den that is clearly a little too tight, Mia giggling beside her.',
  'bit.s5':
    'Mia and the round pink pig sitting side by side inside the finished little den, peeking out of the opening, cosy and pleased.',
  'bit.s6':
    'A small wooden den in the grass at golden hour with Mia and the round pink pig snug inside together.',

  'choice.hit':
    'A small simple wooden mallet tapping a peg, isolated centered on a soft cream background.',
  'choice.fit':
    'A small simple wooden board sliding into a slot, isolated centered on a soft cream background.',
  'choice.bit':
    'A small simple tiny wooden den just big enough for one, isolated centered on a soft cream background.',

  // A Gift for Waldo scenes (unit 9)
  'pigcat.s1':
    'The round pink pig holding out a small handmade cloth bag as a gift, the orange tabby cat waiting nearby, soft warm light.',
  'pigcat.s2':
    'A close view of a small handmade cloth bag resting on the grass, looking a little worse for wear.',
  'pigcat.s3a':
    'Mia carefully sewing up a small tear in the side of a handmade cloth bag with a big needle and thread.',
  'pigcat.s3b':
    'Mia gently wiggling a stuck zip on a small handmade cloth bag, tongue poking out in concentration.',
  'pigcat.s4':
    'Mia tipping a small cloth bag upside down and a soft ribbon sliding out of it onto the grass, the orange tabby cat watching with wide eyes.',
  'pigcat.s5':
    'The round pink pig holding out the mended cloth bag to the orange tabby cat with a shy proud smile.',
  'pigcat.s6':
    'The orange tabby cat with a soft ribbon tied in a bow on its tail, purring beside the round pink pig. Warm golden light.',

  'choice.rip':
    'A small simple piece of cloth with a little tear in it, isolated centered on a soft cream background.',
  'choice.zip':
    'A small simple zip pull on a strip of fabric, isolated centered on a soft cream background.',
  'choice.tip':
    'A small simple cloth bag being tipped upside down, isolated centered on a soft cream background.',

  // The Dress Up Show scenes (unit 10)
  'wig.s1':
    'A wooden dress up box tipped over on the garden grass with hats, scarves and a curly yellow wig spilling out, Mia and the round pink pig delighted.',
  'wig.s2':
    'A floppy hat and a stripy little coat laid out side by side on the grass beside a dress up box.',
  'wig.s3a':
    'The round pink pig wearing a floppy hat that has slid down over one eye, looking very pleased with herself.',
  'wig.s3b':
    'Mia doing up the zip on a stripy little coat that the round pink pig is wearing, both concentrating.',
  'wig.s4':
    'The round pink pig wearing a curly yellow wig and twirling on the grass, Mia clapping with delight.',
  'wig.s5':
    'Mia and the round pink pig sitting on a picnic blanket after the show, the pig licking her lip happily, still wearing the curly wig.',
  'wig.s6':
    'Mia in a floppy hat and the round pink pig in a curly yellow wig sitting together in the golden evening grass, both laughing.',

  'choice.wig':
    'A small simple curly yellow wig, isolated centered on a soft cream background.',
  'choice.lip':
    'A small simple happy smiling mouth licking its lip, isolated centered on a soft cream background.',

  'choice.fan': 'A small simple paper hand fan, isolated centered on a soft cream background.',
  'choice.can': 'A small simple watering can, isolated centered on a soft cream background.',
  'choice.ran':
    'A small simple happy orange cat running, isolated centered on a soft cream background.',
  'choice.log': 'A small simple mossy fallen log, isolated centered on a soft cream background.',
  'choice.hop':
    'A small simple fluffy brown dog mid-hop in the air, isolated centered on a soft cream background.',
  'choice.dog':
    'A small simple fluffy brown dog with floppy ears, isolated centered on a soft cream background.',

  // Hot Pot scenes (unit 12)
  'pot.s1':
    'Mia stirring a big cast iron pot of soup on a little stove in a cozy kitchen, warm steam rising, the fluffy brown dog shaking rain off his coat by the door.',
  'pot.s2':
    'A round pot lid and a bubbling pot of soup side by side on a wooden kitchen table.',
  'pot.s3a':
    'Mia setting the round lid on top of the big soup pot with both hands, looking pleased.',
  'pot.s3b':
    'A big pot of soup bubbling and steaming on the stove, warm orange firelight glowing underneath.',
  'pot.s4':
    'Mia ladling soup from the big pot into two warm bowls, the fluffy brown dog watching eagerly.',
  'pot.s5':
    'The fluffy brown dog lapping soup from a low bowl on the kitchen floor, tail wagging happily.',
  'pot.s6':
    'Mia and the fluffy brown dog sitting together by the warm stove with their empty bowls, cozy and content.',

  'choice.pot': 'A small simple cast iron cooking pot, isolated centered on a soft cream background.',
  'choice.top':
    'A small simple round pot lid with a knob handle, isolated centered on a soft cream background.',
  'choice.hot':
    'A small simple bowl of steaming hot soup with wavy steam lines, isolated centered on a soft cream background.',

  // The Dog and the Pig scenes (unit 13, short O spiral)
  'dogpig.s1':
    'The round pink pig trotting in from the garden with muddy trotters, leaving a trail of round muddy spots across a wooden kitchen floor.',
  'dogpig.s2':
    'A mop leaning against a bucket of soapy water beside a floor dotted with muddy spots.',
  'dogpig.s3a':
    'The fluffy brown dog holding a mop in his paws and pushing it across the wooden floor, very determined.',
  'dogpig.s3b':
    'The round pink pig happily popping floating soap bubbles with her snout, bubbles drifting everywhere.',
  'dogpig.s4':
    'Mia pointing at one last small muddy spot on the clean wooden floor, the dog and the pig peering at it closely.',
  'dogpig.s5':
    'The fluffy brown dog wiping the last muddy spot with a cloth under his paw, the floor gleaming.',
  'dogpig.s6':
    'Mia, the fluffy brown dog and the round pink pig sitting proudly together on a spotless clean floor.',

  'choice.mop':
    'A small simple mop with a wooden handle, isolated centered on a soft cream background.',
  'choice.pop':
    'A small simple round soap bubble bursting with tiny sparkles, isolated centered on a soft cream background.',
  'choice.dot':
    'A small simple round brown mud spot, isolated centered on a soft cream background.',

  // The Wet Hen scenes (unit 14)
  'hen.s1':
    'Soft rain falling over a garden pond, a plump red-brown hen with a red comb slipping into the shallow water looking startled.',
  'hen.s2':
    'A long handled net lying on the grassy pond bank in the rain, the pond water rippling.',
  'hen.s3a':
    'Mia kneeling on the pond bank dipping a long handled net toward the wet hen.',
  'hen.s3b':
    'The fluffy brown dog wading into the shallow pond with water up to his tummy, splashing happily.',
  'hen.s4':
    'The plump red-brown hen safe on the grass, shaking water from her feathers in a bright spray of droplets.',
  'hen.s5':
    'The fluffy brown dog shaking out his soaked fur with water flying everywhere, Mia laughing and shielding her face.',
  'hen.s6':
    'Mia wrapping the plump red-brown hen in a soft towel beside the fluffy brown dog, all three warm and dry as the rain stops.',

  'choice.net':
    'A small simple long handled scoop net, isolated centered on a soft cream background.',
  'choice.wet':
    'A small simple blue water droplet splash, isolated centered on a soft cream background.',
  'choice.hen':
    'A small simple plump red-brown hen with a soft red comb, isolated centered on a soft cream background.',

  // Hug the Bug scenes (unit 15)
  'bug.s1':
    'Mia crouching in the shady grass looking closely at a tiny round ladybug resting on a cold green leaf.',
  'bug.s2':
    'A bright patch of golden sunlight on the grass beside a pair of gently cupped hands.',
  'bug.s3a':
    'Mia carefully carrying a green leaf with a tiny ladybug on it into a warm patch of golden sunlight.',
  'bug.s3b':
    'Mia gently cupping both hands around a tiny ladybug, holding it close and warm.',
  'bug.s4':
    'A tiny round ladybug opening her shiny red wings in the warm sunlight, Mia watching with delight.',
  'bug.s5':
    'Mia running through tall sunlit grass with a tiny ladybug flying along beside her.',
  'bug.s6':
    'Mia sitting in the warm grass at golden hour with a tiny ladybug perched on her finger, both content.',

  'choice.bug':
    'A small simple round red ladybug with black spots, isolated centered on a soft cream background.',
  'choice.hug':
    'A small simple pair of gently cupped hands held together, isolated centered on a soft cream background.',
  'choice.sun':
    'A small simple warm yellow sun with soft rays, isolated centered on a soft cream background.',

  // Mia's Big Day scenes (unit 16, all vowels boss)
  'party.s1':
    'A cheerful garden party with bunting strung between the trees, Mia in the middle with the orange tabby cat, the round pink pig, the fluffy brown dog, the red-brown hen and a tiny ladybug all gathered around her.',
  'party.s2':
    'A wooden garden table with a small round cake on one side and an empty wooden bowl on the other, bunting overhead.',
  'party.s3a':
    'Mia carefully cutting a small round cake into neat slices on a wooden garden table while her friends watch.',
  'party.s3b':
    'The plump red-brown hen tipping a wooden bowl of nuts onto the garden table, nuts scattering merrily.',
  'party.s4':
    'Mia and all five garden friends playing together on the grass under the bunting, everyone joyful.',
  'party.s5':
    'The garden at sunset with the sun low and golden, Mia and all her friends sitting together on the grass.',
  'party.s6':
    'Mia hugging all of her garden friends at once in the warm evening light, empty cake plates around them.',

  'choice.cut':
    'A small simple slice of cake on a little plate, isolated centered on a soft cream background.',
  'choice.nut':
    'A small simple brown acorn nut, isolated centered on a soft cream background.',
  'choice.fun':
    'A small simple cluster of colorful party balloons, isolated centered on a soft cream background.',

  // ---- Mia's Garden world ----
  // A big explorable storybook map (displayed larger than the screen and panned
  // like a Pokemon overworld). Distinct nooks sit at the corners and edges so a
  // friend can live in each one. Background only, characters are separate cutouts.
  'world.bg':
    'A big cozy top-down storybook map of a little girl\'s whole garden world in soft watercolor, seen from a gentle bird\'s eye angle. A soft winding dirt path loops through a wide grassy garden and connects several clear distinct cozy nooks with open ground in each: a sunny wooden porch with a cushion in the upper left, a little fenced hen coop in the upper right, a small leafy flower and plant patch near the center bottom, a soft brown mud puddle pen in the lower left, and a cozy wooden dog house in the middle right. A small round pond and a leafy tree sit near the center. Lots of soft open grass between nooks with room to walk around. Muted sage green, terracotta, warm cream, dusty blue and soft mustard. Completely empty: no characters, no people, no animals anywhere. ABSOLUTELY NO words, letters, labels, signs, numbers, or text anywhere in the image. Calm, warm and inviting.',

  // Sprites are generated on a plain solid white studio backdrop (the one flat
  // background the model renders reliably and uniformly). scripts/cutout.ts
  // flood-fills the white inward from the edges to a transparent cutout, which
  // preserves interior cream/white details (a shirt, white socks) since those
  // aren't connected to the border.
  'world.mia':
    'Mia, a 3 year old girl with light brown curly hair in two low pigtails, dusty blue overall dress over a cream shirt and warm terracotta cardigan, holding her small sage green stuffed rabbit, standing and waving happily. Full body, centered, facing the viewer. The entire background is a plain, solid, pure flat white, perfectly even and uniform with no scenery, no ground, no shadow, no gradient and no texture. Only Mia is painted; every pixel of the background is plain white.',
  'world.waldo':
    'The small orange tabby cat sitting upright with a warm happy smile, looking friendly. Full body, centered, facing the viewer. The entire background is a plain, solid, pure flat white, perfectly even and uniform with no scenery, no ground, no shadow, no gradient and no texture. Only the cat is painted; every pixel of the background is plain white.',
  'world.rosie':
    'A round happy pink pig standing on all fours with a cheerful smile and curly tail. Full body, centered, facing the viewer. The entire background is a plain, solid, pure flat white, perfectly even and uniform with no scenery, no ground, no shadow, no gradient and no texture. Only the pig is painted; every pixel of the background is plain white.',
  'world.biscuit':
    'The medium fluffy brown dog sitting with floppy ears, kind eyes and a happy wagging tail. Full body, centered, facing the viewer. The entire background is a plain, solid, pure flat white, perfectly even and uniform with no scenery, no ground, no shadow, no gradient and no texture. Only the dog is painted; every pixel of the background is plain white.',
  'world.ruby':
    'A plump friendly red-brown hen with a soft red comb, standing and looking cheerful. Full body, centered, facing the viewer. The entire background is a plain, solid, pure flat white, perfectly even and uniform with no scenery, no ground, no shadow, no gradient and no texture. Only the hen is painted; every pixel of the background is plain white.',
  'world.bea':
    'A tiny cute friendly round ladybug with a gentle smiling face and little legs, soft and storybook. Full body, centered, facing the viewer, drawn fairly large and clear. The entire background is a plain, solid, pure flat white, perfectly even and uniform with no scenery, no ground, no shadow, no gradient and no texture. Only the ladybug is painted; every pixel of the background is plain white.',
  'world.sprout':
    'A single tiny green seedling sprout with two small leaves, centered. The entire background is a plain, solid, pure flat white, perfectly even and uniform with no scenery, no shadow, no gradient and no texture. Only the sprout is painted; every pixel of the background is plain white.',
  'world.flower.a':
    'A single small soft watercolor flower with terracotta petals and a green stem, centered. The entire background is a plain, solid, pure flat white, perfectly even and uniform with no scenery, no shadow, no gradient and no texture. Only the flower is painted; every pixel of the background is plain white.',
  'world.flower.b':
    'A single small soft watercolor flower with warm mustard yellow petals and a green stem, centered. The entire background is a plain, solid, pure flat white, perfectly even and uniform with no scenery, no shadow, no gradient and no texture. Only the flower is painted; every pixel of the background is plain white.',
  'world.flower.c':
    'A single small soft watercolor flower with dusty blue petals and a green stem, centered. The entire background is a plain, solid, pure flat white, perfectly even and uniform with no scenery, no shadow, no gradient and no texture. Only the flower is painted; every pixel of the background is plain white.',

  // ---- Treasures (collectible rewards, white background -> cutout) ----
  'treasure.shell':
    'A single small pretty spiral seashell in soft watercolor, centered. The entire background is a plain, solid, pure flat white, perfectly even and uniform with no scenery, no shadow, no gradient and no texture. Only the shell is painted; every pixel of the background is plain white.',
  'treasure.leaf':
    'A single soft autumn leaf in warm watercolor, centered. The entire background is a plain, solid, pure flat white, perfectly even and uniform with no scenery, no shadow, no gradient and no texture. Only the leaf is painted; every pixel of the background is plain white.',
  'treasure.acorn':
    'A single little acorn with its textured cap, soft watercolor, centered. The entire background is a plain, solid, pure flat white, perfectly even and uniform with no scenery, no shadow, no gradient and no texture. Only the acorn is painted; every pixel of the background is plain white.',
  'treasure.pebble':
    'A single smooth round speckled pebble, soft watercolor, centered. The entire background is a plain, solid, pure flat white, perfectly even and uniform with no scenery, no shadow, no gradient and no texture. Only the pebble is painted; every pixel of the background is plain white.',
  'treasure.feather':
    'A single soft fluffy feather in gentle watercolor, centered. The entire background is a plain, solid, pure flat white, perfectly even and uniform with no scenery, no shadow, no gradient and no texture. Only the feather is painted; every pixel of the background is plain white.',
  'treasure.berry':
    'A small cluster of two round red berries with a tiny green leaf, soft watercolor, centered. The entire background is a plain, solid, pure flat white, perfectly even and uniform with no scenery, no shadow, no gradient and no texture. Only the berries are painted; every pixel of the background is plain white.',
  'treasure.pinecone':
    'A single small brown pinecone, soft watercolor, centered. The entire background is a plain, solid, pure flat white, perfectly even and uniform with no scenery, no shadow, no gradient and no texture. Only the pinecone is painted; every pixel of the background is plain white.',
  'treasure.stone':
    'A single smooth grey river stone, soft watercolor, centered. The entire background is a plain, solid, pure flat white, perfectly even and uniform with no scenery, no shadow, no gradient and no texture. Only the stone is painted; every pixel of the background is plain white.',
};
