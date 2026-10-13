# Uncertain items for review

These are the places where the atlas makes a judgment call, the sources disagree, or the drawing is looser than
it looks. Each item names the feature id so you can find it in `data/eras/`.

**Eras:** [1](#era-1-conquest-15191521) · [2](#era-2-expansion-and-early-colony-15211600) ·
[3](#era-3-mature-colony-16001760) · [4](#era-4-bourbon-reforms-17601810) · [5](#era-5-war-of-independence-18101821) ·
[6](#era-6-early-republic-and-territorial-loss-18211854) · [7](#era-7-reform-and-french-intervention-18541876) ·
[8](#era-8-porfiriato-18761911) · [9](#era-9-revolution-19101920) · [10](#era-10-consolidation-19201940) ·
[11](#era-11-pri-era-19402000) · [12](#era-12-2000-to-the-present-20002026)

## How the data was checked

- Every era was built from the cited sources and then went through a separate, independent fact-checking pass
  covering dates, claims, numbers, citations, URLs, route waypoints and territory outlines, whose corrections were
  applied. Features added during a fact-check are marked † below.
- Every era was then compared with the book the atlas accompanies, Paul Gillingham, *Mexico: A 500-Year History*
  (Atlantic Monthly Press, 2025). Features added in that pass are marked ‡. Where the book and the atlas's other
  sources disagree, the atlas keeps the best-supported value, the feature's note gives Gillingham's, and each era
  below lists them under "Differences from Gillingham". Some are slips in the book (e.g. Cananea dated 1907); most
  are ordinary disagreements between sources.
- Every point with a `modern_place` was geocoded against OpenStreetMap (`npm run check:places`). All are within
  5 km except a few that are explained in their notes and below (e.g. `e1-centla`, `e2-hawikuh`,
  `e3-fort-st-louis`, `e8-tres-castillos`), where the geocoder can only find a nearby town or marker.
- For Mexican towns Nominatim often returns the *municipality* centroid, which can be 5–15 km from the town, and
  sometimes a namesake elsewhere. The check script prefers town nodes, and the fact-checkers read the matched
  place name of every cached geocode, not just the distance.
- Territories drawn from modern states (`from_states`) use modern lines as a stand-in for historical ones; each
  one's note says which states it uses and where the historical unit differed.
- Era 12 includes events from 2025–26. Each was confirmed in at least two independent news organisations, but
  recent events have little scholarship behind them yet, and figures may still be revised.

## Era 1: Conquest (1519–1521)

### Territories (all schematic or approximate)

- **`e1-triple-alliance`**: a hegemonic tribute empire with no borders, drawn simply from the province maps in
  Berdan et al. (1996).
  - Least certain: the northern limit in the Huasteca (Oxitipan, Tuxpan); the Pacific coast between the Balsas
    mouth and Acapulco (Cihuatlan); the eastern limit toward Coatzacoalcos and the Isthmus (Tehuantepec is left
    outside); and the extent of the detached Xoconochco (Soconusco) province.
  - Huexotzinco, also outside Aztec control in 1519, is **not** cut out.
- **`e1-tarascan-state`**: how far Tarascan control reached toward the Pacific (Zacatula, Motines) and into
  Colima/Sayula is debated. The Lerma–Balsas frontier with the Aztecs is the best-attested part.
- **`e1-tlaxcala-state`** approximates the core of modern Tlaxcala state. **`e1-metztitlan`**,
  **`e1-yopitzinco`** and **`e1-tututepec`** are schematic placeholders for unconquered polities.
- **`e1-lake-texcoco`**: the shoreline is hand-drawn as one average outline anchored to known lakeshore and
  island settlements.
  - In reality the five lakes stood at slightly different levels and the shore moved with the seasons.
  - The Tenochtitlan–Tlatelolco island outline is schematic.
  - A possible improvement is to derive the shoreline from a DEM contour near 2,240 m, but subsidence of the
    modern lakebed (up to ~10 m under Mexico City) would distort it.
- **`e1-causeways`** and **`e1-dike-nezahualcoyotl`** follow later street alignments (México–Tacuba, Calzada de
  Tlalpan, Calzada de los Misterios) and the dike's two documented end points; the routes between are approximate.

### Dates and places

- **`e1-centla`**: Potonchán's site is not securely identified, so the point sits on the lower Grijalva about
  8 km from Frontera. Sources give either ~14 March or 25 March 1519, so only the month is shown.
- **`e1-tlaxcala-battles`**: the sequence and days of the Tlaxcalan battles differ between sources (31 Aug–6 Sep
  1519 shown).
- **`e1-cholula`**: shown to the month. The usual date is ~18 October 1519. The point is at the San Gabriel
  convent, the traditional site of the temple courtyard, not the Great Pyramid.
- **`e1-narvaez`** and **`e1-toxcatl`**: given to the month (late May 1520; May 1520).
- **`e1-otumba`**: 7 July 1520 is the consensus; some sources give 8 July.
- **`e1-noche-triste`**: casualty figures vary enormously (Cortés claimed ~150 Spaniards; other estimates run to
  600+). The description avoids a number beyond "perhaps half".
- **`e1-chapultepec-aqueduct`**: 26 May 1521 follows Hassig; accounts vary by a day or two.
- **`e1-cozumel`**†, **`e1-iztapalapa-1521`**†, **`e1-chalco`**†, **`e1-cuauhnahuac`**†, **`e1-xochimilco`**†:
  given to the month only.

### Routes

- **`e1-march-inland`**: the passage from Xico over the Sierra to Zautla and Ixtacamaxtitlán (via Ixhuacán and the
  pass near the Cofre de Perote) is reconstructed.
- **`e1-paso-de-cortes`**: identification with the modern pass is traditional.
- **`e1-retreat`**: only the main stops are documented. The line is schematic, and several stop identifications
  (Citlaltepec and others) are debated.
- **`e1-brigantines`** and **`e1-encirclement`**†: schematic between documented stops.
- **`e1-meeting`**: the location (near the Hospital de Jesús) is traditional.

### Not mapped

The 1520 smallpox epidemic is not mapped as a feature; it is covered in the era summary.

### Book pass (Gillingham, *Mexico: A 500-Year History*, 2025) ‡

Read: Introduction and chapters 1–3 in full; Part Two grepped. The book's account of 1519–21 is chapter 1. It
supports the existing features; Gillingham is added as a source on 24 of them. One feature is added:

- **`e1-colhuacatonco`**‡ (30 June 1521): Cortés's defeat on the way to the Tlatelolco market, after which dozens
  of Spaniards were sacrificed and many allies went home for a time. Gillingham dwells on it as the turning point
  of the siege. The point is on the line of the modern Calle República de Chile, the street usually identified with
  Cortés's line of advance. The fighting covered the Cuepopan district and spread into Tlatelolco, so the point is
  approximate. Sources: Cortés's Third Letter, Díaz, Sahagún, Hassig and the book. The date and the street come from
  the Wikipedia article on the battle, which draws on these sources.
- **`e1-cholula`**: the description now adds that several historians, Gillingham among them (following Restall),
  think the Tlaxcalans steered the Spaniards there and supplied the story of the ambush.
- **`e1-tepeaca`**: the description now says that Cortés's second letter (30 October 1520), which proposed the name
  New Spain, was dated at Segura de la Frontera. Gillingham makes a point of the naming.
- **`e1-narvaez`**: the description now names Francisco de Eguía, the enslaved African traditionally blamed for
  bringing smallpox (Gillingham, Thomas).
- **`e1-meeting`**: the book's spelling, Montezuma, is given once.
- **`e1-tizatlan`**: the book's spelling, Ocotelulco, is given in the note.

### Differences from Gillingham

- **`e1-noche-triste`**: Gillingham puts the escape on the night of 1 July 1520; the atlas shows 30 June–1 July.
  He estimates about 900 Spaniards killed (from Cortés's December muster) and 4,000 Tlaxcalans (Ixtlilxóchitl).
  Both are now in the note.
- **`e1-siege-alvarado`**: Gillingham (chs. 1 and 4) dates the start of the siege to 13 May 1521. Most modern
  accounts have the divisions take up their positions about 22 May and cut the aqueduct on 26 May, and the atlas
  keeps those dates. Now in the note.
- **`e1-triple-alliance`**: Gillingham counts the Zapotecs among the peoples the empire did not conquer. The map
  keeps the Valley of Oaxaca inside, held through the Huaxyacac garrison, with the Isthmus (Tehuantepec) outside.
  Now in the note.
- **`e1-tarascan-state`**: Gillingham dates the failed Aztec invasion to 1478 (the atlas says "around 1479").
  Sources give 1476–79. Now in the note.
- **`e1-brigantines`**: the book's figure of 8,000 porters over about fifty miles is now in the note.
- Not noted on any feature:
  - Gillingham says Cortés sailed with about 450 men, against the summary's "about 500". Usual totals are
    500–530 soldiers plus sailors.
  - He has Aguilar and Guerrero both learn Chontal Maya; the atlas says Aguilar learned Yucatec Maya.
  - He places the outbreak of smallpox at Chalco at the end of September 1520. Most accounts trace it from
    Cempoala to Tenochtitlan in October.

## Era 2: Expansion and early colony (1521–1600)

### Territories (both schematic)

- **`e2-nueva-galicia`**: drawn with `from_states` as Jalisco + Nayarit + Zacatecas + Aguascalientes, a rough stand-in for
  Gerhard's map in *The North Frontier of New Spain*.
  - Fact-check: the four states match the usual short description of the kingdom's stable extent (e.g. Spanish
    Wikipedia, "Reino de Nueva Galicia"), so the set was kept. Adding Sinaloa (for Culiacán) or Durango was considered
    and rejected: in 1550 most of Sinaloa was unconquered and Durango was an open frontier that became Nueva Vizcaya
    in 1562, so either would overstate the kingdom more than leaving them out understates it.
  - It is too large in the south: southern Jalisco (the provinces of Ávalos, Autlán, Amula and Tuxpan, around Sayula,
    Zapotlán and Autlán) and the Colima hinterland belonged to Nueva España, not Nueva Galicia. (The builder's note
    also put the Lagos area in Nueva España; that was removed, since Lagos was a Nueva Galicia jurisdiction.)
  - It is too small in the northwest: Culiacán (Sinaloa) belonged to Nueva Galicia and is not included.
  - The northern limit was an open war frontier; the Zacatecas state line is only a convenience.
  - A hand-drawn outline following Gerhard's jurisdiction map would be more faithful, if you want one.
- **`e2-gran-chichimeca`**: a hand-drawn outline of the war zone after the map in Powell, *Soldiers, Indians, and Silver*
  (1952). The peoples of the region had no common territory, and the zone moved north between 1550 and 1590.

### Dates and places

- **`e2-mexico-city`**: shown as 1521–1524. Sources date the decision to rebuild on the island to late 1521 or 1522; the
  town council moved from Coyoacán in 1524.
- **`e2-panuco`**: Santisteban del Puerto is marked at modern Pánuco. Gerhard places the villa on the river nearby; the
  exact site is not identified.
- **`e2-iximche`**: Alvarado declared Iximché a Spanish town on 25 or 27 July 1524 (sources differ); only the month
  (1524-07) is now shown.
- **`e2-cuauhtemoc-execution`**: marked at the El Tigre site, usually identified with Itzamkanac. Some sources place the
  execution at another Acalan town (Taxahá). Traditionally 28 February 1525; shown to the month.
- **`e2-la-antigua`**: the move from Villa Rica to La Antigua is dated 1523–1525 in different sources; 1525 is shown.
- **`e2-veracruz-nueva`**: the move to the present site is dated 1599 or 1600.
- **`e2-xelha`**: the battle of Aké (1528) is not mapped. The Aké that Chamberlain describes lay near Tizimín, in the
  northeast, and is not the archaeological site of Aké near Tixkokob; it is not securely located.
- **`e2-campeche`**: local tradition gives 4 October 1540; Chamberlain dates the permanent town council to early 1541.
  1541 is shown.
- **`e2-valladolid-yucatan`**: sources give 23, 27 or 28 May 1543 for the first founding at Chauac-Há; the move to Zací
  was 24 March 1545. The point marks the second site.
- **`e2-maya-revolt-1546`**: the rising covered several eastern provinces; the point (just northeast of Valladolid) is
  schematic and has no `modern_place`.
- **`e2-mani-1562`**: the number of Maya books burned is not reliably known (a figure of 27 appears in later sources),
  so the description gives none.
- **`e2-guzman`**: the cazonci's execution (14 February 1530) is placed on the Lerma near Puruándiro, which is
  approximate. Chiametla is marked at Escuinapa. The coastal province of Aztatlán is not given its own vertex.
- **`e2-guadalajara-sites`**: sources differ on the first founding at Nochistlán (January 1531 or 5 January 1532) and on
  the move to Tlacotán (1535 or about 1537). Tlacotán is marked at the modern village; the colonial site is nearby.
- **`e2-queretaro`**: the traditional founding date of 25 July 1531 is disputed; some historians prefer about 1540.
- **`e2-quiroga`**: Quiroga was appointed bishop in 1536 and consecrated in 1538; the see moved to Pátzcuaro in
  1538–40. The craft-specialisation story is partly tradition and is described as such.
- **`e2-valladolid-michoacan`**: usually dated 18 May 1541; only the year is shown.
- **`e2-taxco`**: mining began around 1534; the first workings were at Taxco el Viejo, south of the modern town.
- **`e2-pachuca-patio`**: Medina's method is dated 1554 or 1555. The refining hacienda is not located; the point marks Pachuca.
- **`e2-guanajuato`**: dates for the first strikes vary from 1548 to the mid-1550s. The real de minas dates from about
  1554, the town was legally constituted about 1570 (INAH), and it became a villa in 1679 (some sources say 1619).
  Shown as 1548–1557.
- **`e2-zacatecas`**: Tolosa's party reached the Bufa in September 1546 (8 September in Bakewell); the rich veins and
  formal settlement date from 1548. Shown as 1546-09 to 1548.
- **`e2-sombrerete`**: 1555 rests on general sources (tradition credits Juan de Tolosa); not checked against Bakewell
  directly.
- **`e2-saltillo`**: 1577 is usual; some sources give 1575.
- **`e2-tlaxcalan-colonies`**: sources disagree on whether there were six or eight colonies and on how the 400
  families were divided; only San Esteban (Saltillo) and Colotlán are named.
- **`e2-mixton`**: the Mixtón peñol has not been securely located. The point marks Apozol, in the Juchipila valley where
  tradition puts it, and is schematic. The war is dated 1540–1542 (some sources begin it in 1541).
- **`e2-nochistlan-1541`**: most accounts place Alvarado's failed attack at the peñol of Nochistlán; Spanish Wikipedia
  and some others place it at Mixtón. Marked at Nochistlán.
- **`e2-guadalajara-1541`**: the attack is dated September 1541 (traditionally 28 September); shown to the month.
- **`e2-hawikuh`**: coordinates from Wikipedia's entry for the ruins. The geocoder check uses Zuni Pueblo, 19.6 km away;
  this is the one flagged point and it is expected. Usually dated 7 July 1540; shown to the month.
- **`e2-la-toma`**: placed near San Elizario, Texas, by convention; the exact spot is not known.
- **`e2-acoma`**: Acoma deaths are given as 500 to 800 or more; whether the foot amputations were all carried out is
  disputed.

### Routes

- **`e2-alvarado-guatemala`**: the route through Oaxaca to Tehuantepec is assumed. Battle dates in Guatemala differ
  between sources.
- **`e2-hibueras`**: schematic between Coatzacoalcos and Acalan (the Tabasco crossing) and between Lake Petén and Nito.
  Nito is marked at Livingston. The return voyage (Trujillo–Havana–Veracruz, 1526) is not drawn.
- **`e2-coronado`**: outward route only. The Río Mayo vertex and Chichilticale (in the Sulphur Springs Valley) are
  schematic. Corazones is placed at Ures, the crossing into Arizona at the Coronado National Memorial, Tiguex at Kuaua,
  the plains camp at Blanco Canyon (Floydada) and Quivira at Lyons, Kansas. Each of these is a scholarly reconstruction,
  and several are debated.
- **`e2-camino-real`**: the description now says "for a time the longest road in North America" (NPS) instead of "the
  first long wagon road", which was not confirmed, and gives the full length as some 2,500 km (usual figures are
  2,560–2,600 km from Mexico City to Santa Fe). The road shifted over time and had branches (via Celaya and León, via Lagos). North of Durango
  the line through Indé to Santa Bárbara is schematic.
- **`e2-onate`**: the Chihuahua vertex is schematic (the expedition crossed the Conchos and went north through the
  desert). The departure from the Conchos camp is given in different sources as January, February or March 1598, so
  only the year is used for the start.
- **`e2-galleon-westbound`** and **`e2-galleon-eastbound`**: schematic. The validator allows longitudes only to 130°W,
  so both lines stop at the map edge. The eastbound line enters at 41°N and makes landfall at Cape Mendocino. Real
  landfalls ranged from about Cape Mendocino to Point Conception and moved south over time. Urdaneta's 1565 landfall
  is given variously as near Santa Rosa or Santa Catalina Island; the note now says it lay farther south than the
  drawn landfall. The description now credits the route to Urdaneta aboard the San Pedro (Acapulco, 8 October 1565).
  Both lines stay schematic.

### Not mapped

- The **cocoliztli epidemics of 1545–48 and 1576–80**, which killed a large share of the Indigenous population, are
  not mappable as features. They belong in the era summary.
- The **Mixtón War campaign of Viceroy Mendoza** (October 1541–early 1542) is described in **`e2-mixton`** and
  **`e2-guadalajara-1541`** but not drawn as a route; his line of march is not well documented.
- **Olid's voyage** to Honduras (1524) is mentioned in **`e2-hibueras`** but not drawn.
- **Nueva Vizcaya** is represented by **`e2-durango`** rather than a polygon. Its extent in the 1560s–90s was a
  scatter of mining camps and missions, too thin to draw honestly.
- The **Rodríguez–Chamuscado (1581) and Espejo (1582–83) entradas** to New Mexico are mentioned, not drawn.
- **Cabeza de Vaca's** overland journey (1528–36) is mentioned in **`e2-culiacan`**. Its route is too disputed to draw.
- **Carvajal's Nuevo Reino de León** (1579–89) is mentioned in **`e2-monterrey`**; its claimed extent was enormous and
  never occupied.
- The **Audiencia de los Confines / Guatemala** and its boundary with New Spain are not drawn.

### Sources

- Fact-check: the citations the builder flagged were checked against library catalogues and reviews, and all exist as
  cited: Fintan B. Warren, *Vasco de Quiroga and His Pueblo-Hospitals of Santa Fe* (Washington: Academy of American
  Franciscan History, 1963; it grew from his 1963 UNM dissertation, and he later published as J. Benedict Warren);
  Henry R. Wagner, *Spanish Voyages to the Northwest Coast of America in the Sixteenth Century* (California Historical
  Society, Special Publication 4, 1929); J. Lloyd Mecham, *Francisco de Ibarra and Nueva Vizcaya* (Duke University
  Press, 1927); Harry Kelsey, *Sir John Hawkins: Queen Elizabeth's Slave Trader* (Yale University Press, 2003); Arturo
  Giráldez, *The Age of Trade* (Rowman & Littlefield, 2015). Powell's *Mexico's Miguel Caldera* (University of
  Arizona Press, 1977) was not looked up online but is a well-known work.
- The only URL used is the NPS Camino Real de Tierra Adentro history page, which was fetched and supports the claims.
  The UNESCO page for the Camino Real (whc.unesco.org/en/list/1351) returned HTTP 403 and is not cited.
- Fact-check of the geocoder cache: every point's cached display name was read and is the intended place (no
  namesakes or municipality centroids), and the coordinates agree with known positions.

### Book pass (Gillingham, *Mexico: A 500-Year History*, 2025) ‡

Read: Introduction and chapters 1–3 in full. Chapters 4–7 (Part Two) were grepped for 1521–1600 topics. Gillingham
is added as a source on 34 existing features. Eight features are added. Each has the book plus at least one
independent source:

- **`e2-chetumal-guerrero`**‡ (1527–1536): the book opens with Gonzalo Guerrero. Marked at modern Chetumal. The
  site of the Maya capital of Chactemal is debated (Santa Rita Corozal in Belize, about 14 km south, or Oxtankah).
  The dates of Montejo's approach (1528) and of Dávila's Villa Real (1531, untenable by 1533) follow Chamberlain as
  summarised in secondary works; the volume was not reopened. Most accounts date Guerrero's death to 1536;
  Gillingham gives 1534 or 1535.
- **`e2-twelve-franciscans`**‡ (May–June 1524): a schematic route from San Juan de Ulúa through Tlaxcala to Mexico
  City. Only the end dates are documented (13/14 May and 17/18 June 1524, Ricard). Tlaxcala is the traditional
  intermediate stop.
- **`e2-colegio-tlatelolco`** (6 January 1536): marked at Santiago Tlatelolco.
- **`e2-tepeyac`**‡ (1556): dated by the Montúfar–Bustamante controversy of September 1556, the first secure
  documentation of the cult. The 1531 apparitions are given as tradition, first published in 1648–49 (Poole). The
  Tonantzin link is attributed to Sahagún. The era-3 history of the cult is in the handoff file.
- **`e2-cuernavaca-marquesado`**‡ (1529–1547): sources give 2, 6 or 20 July 1529 for the grant, so only the year is
  shown. The 23,000 vassals figure is the usual one. The palace dates (core 1520s, completed 1535) are from INAH.
- **`e2-mezquital`**‡ (1530–1600): Melville's thesis that sheep degraded the valley is influential but contested;
  the note says so. The point (Ixmiquilpan) stands for a region.
- **`e2-aguascalientes`** (22 October 1575, the founding licence from the audiencia of Nueva Galicia): founders
  given as "about a dozen" because sources say twelve or thirteen. Gillingham's 1609 refounding is attributed to him
  in the note and was not independently checked.
- **`e2-avila-conspiracy`**‡ (3 August 1566): marked at the Ávila houses at the corner of Guatemala and Argentina,
  next to the Templo Mayor (Sánchez Reyes 2017, INAH). The arrests on 16 July 1566 and the role of the 1567–68
  inquiry (Muñoz) come from general sources. Whether a plot existed is doubted.

Descriptions extended from the book (with the existing sources):

- **`e2-guzman`**: the hurricane of September 1530 at Aztatlán.
- **`e2-mani-1562`**: Clendinnen's figures of about 4,500 tortured and 158 dead, which the book repeats. The atlas
  already cites Clendinnen.
- **`e2-galleon-eastbound`**: the San Lucas, piloted by Lope Martín, crossed some weeks before Urdaneta's San Pedro
  (Reséndez 2021, now cited). The exact arrival date of the San Lucas (usually given as August 1565) was not
  confirmed, so none is stated.

### Differences from Gillingham

- **`e2-hibueras`**: Gillingham has Cortés convalesce for three months in Guatemala before returning. Cortés's Fifth
  Letter and Thomas have him sail from Trujillo via Havana to the Veracruz coast in 1526. Now in the note.
- **`e2-galleon-westbound`**: Gillingham gives up to five months outward and about four back. The usual figures are
  about three months outward and four to six back. Now in the note.
- **`e2-guanajuato`**: Gillingham dates the discovery to 1550, within the atlas's 1548–1557 range. Now in the note.
- **`e2-avila-conspiracy`**: Gillingham says two Spaniards were hanged; the Ávila brothers were beheaded. In the note.
- **`e2-chetumal-guerrero`**: Guerrero's death in 1534/35 (Gillingham) against 1536 (most accounts). In the note.
- Not noted on any feature:
  - The book dates the cocoliztli epidemics to 1545 and 1575 (and the Mexico City outbreak to 1576). The summary's
    1545–48 and 1576–80 are the usual dates.
  - The book says the Grolier codex and other "survivors" besides Paris, Dresden and Madrid are fakes. The Grolier
    (Maya Codex of Mexico) was authenticated in 2016–18. No atlas feature depends on this.
  - The book says Carvajal "had been a crypto-Jew all along". He was convicted of concealing Judaizers, and his own
    belief is debated. **`e2-monterrey`** only says he was arrested by the Inquisition.
  - The book has ten of the first twelve Franciscans settle in Tlaxcala. The usual account divides them among
    Mexico, Texcoco, Tlaxcala and Huejotzingo. **`e2-twelve-franciscans`** names the regions only.

### Not mapped (book pass)

- **Cabeza de Vaca's** trek and **Saavedra's** 1527 Pacific voyage from Zihuatanejo: mentioned in passing by the
  book. The first is already in **`e2-culiacan`**; the second is left out.
- **Espíritu Santo (Coatzacoalcos)**, founded by Sandoval in 1522: already a vertex of **`e2-hibueras`**. A
  separate point was not added.
- **Villa Alta** and the Indigenous garrisons of the Oaxaca sierra, and the Zinacanteco capture of Chamula (1524):
  passing mentions.

### Book pass, items from agent B's handoff ‡

- **`e2-celaya`** (1 January 1571; the licence is dated 12 October 1570) and **`e2-leon`** (20 January 1576) were
  added as Bajío farming and garrison towns of the silver road (Powell, Gerhard, Gillingham ch. 6). Gillingham dates
  León to 1585; the usual date is kept and the book's year is in the note.
- **`e2-quiroga`**: the description now mentions Quiroga's fights with the Augustinians and Franciscans and the
  Tlazazalca convent (1558–62). Cerdá Farías's study of the convent confirms the conflict at Tlazazalca. The book's
  burning of the convent on 23 June 1560 was not confirmed independently, so it is attributed to Gillingham in the
  note.
- **`e2-gran-chichimeca`**: adds the enslavement of captives under the "war by fire and blood" and the Third
  Provincial Council (1585), which questioned the war (Powell; Gillingham ch. 7).
- **`e2-monterrey`**: adds that Carvajal was a slave raider and that the Inquisition burned relatives of his as
  Judaizers (Gillingham ch. 7). His province's claimed extent (the book gives 35,000 square miles) is still not
  drawn.
- **`e2-mexico-city`**: names Alonso García Bravo as planner of the traza.
- **`e2-pachuca-patio`**: Gillingham's 1553, the year Medina learned the method, is in the note. The 1554 date is
  kept.
- **`e2-ulua-1568`**: Gillingham ch. 6 cited (the convoy system that Philip II made compulsory in 1561).
- Already covered by my own pass: the 1566 conspiracy (**`e2-avila-conspiracy`**), Lope Martín
  (**`e2-galleon-eastbound`**), Aguascalientes, and the Mixtón and Maya-revolt citations.
- No change was needed for Zacatecas (Tolosa set out in August 1546, consistent), Veracruz 1600, Guanajuato 1550
  (already noted), or Velasco's 1557 preparations (not a contradiction with the 1564 sailing). The Juzgado General
  de Indios and the 1577 relaciones geográficas are not mappable.

## Era 3: Mature colony (1600–1760)

### Territories

- **`e3-new-mexico-1760`** (schematic): hand-drawn corridor along the Rio Grande from the El Paso district to Taos,
  including Acoma and Laguna but not Zuni or Hopi, after Gerhard and Kessell. It draws the Jornada del Muerto as part of
  the province, although nobody lived there. The real Spanish presence was a string of villages and pueblos a few
  kilometres wide.
- **`e3-texas-1760`** (schematic): the Medina/Nueces line in the southwest and the Arroyo Hondo in the east are
  documented; the northern edge is invented for drawing purposes. It is not the 1836 claim. The coast is clipped to
  land.
- **`e3-baja-california-missions`** (schematic): `from_states` Baja California Sur. The northernmost Jesuit mission in
  1760, Santa Gertrudis (1752), lies just north of the modern state line; the state line is only a stand-in.
- **`e3-nuevo-santander`** (approximate): `from_states` Tamaulipas. It omits the strip north of the Rio Grande to the
  Nueces (including Laredo) and does not reflect the colony's southern edge with the Huasteca.
- No single frontier line is drawn. The mission frontier is shown by the four outlines above and by mission and
  presidio points. A continuous line of 1760 would mostly be guesswork between Sonora, Nueva Vizcaya and Coahuila.

### Dates and places

- **`e3-santa-fe`**: 1610 is the usual date; some sources put the first Spanish settlement at Santa Fe in 1607–08.
- **`e3-kino-dolores`**: the mission ruins of Dolores (Cosari) lie on a hill above the San Miguel River north of
  Cucurpe. English Wikipedia puts them about 30 km north, Spanish Wikipedia about 18 km northeast, and neither gives
  coordinates. The point is a schematic guess at about 18 km and has no `modern_place`.
- **`e3-yaqui-missions`**: marked at Tórim, one of the eight Yaqui towns; the 1740 revolt is described here, not mapped.
- **`e3-tarahumara-revolts`**: shown as 1648–1653 (Teporaca was hanged at Tomochi on 4 March 1653). The 1690 and
  1696–98 risings are described, not mapped. Spanish Wikipedia places the Villa de Aguilar at Basúchil, next to Ciudad
  Guerrero; the point is at Ciudad Guerrero (mission of Papigochi). That the villa "did not survive the wars" (founded
  1649, abandoned c. 1652) follows Deeds as I recall it and was not confirmed in a fetched source.
- **`e3-tepehuan-revolt`**: begun 16 November 1616 at Santa Catalina (now Santa Catarina) de Tepehuanes. The end date
  (1620) is approximate.
- **`e3-san-juan-bautista`**: the mission was founded in 1699 on the Río Sabinas and moved to the Guerrero site in
  1700; the date shown is the move.
- **`e3-pueblo-revolt`**: the casualty figures (about 400 colonists, 21 friars) are the usual ones.
- **`e3-vargas`**: the ceremonial repossession (Vargas arrived 13 September and proclaimed the act on 14 September
  1692; one passage of Wikipedia says 12 September) and the forcible retaking (29–30 December 1693, with about seventy
  defenders executed) are combined in one feature, dated 1692-09-14 to 1693-12-30.
- **`e3-los-adaes`**: sources differ on whether it was the capital from 1721 or formally from 1729 (Handbook of Texas,
  "Los Adaes"), and on when it ceased to be (1770 in NPS, 1772 in the Handbook). Fact-check: it was shown as 1721–1772,
  which ran into era 4, whose **`e4-los-adaes`** covers the abandonment (1773). It is now dated 1721 (the presidio's
  founding), and the abandonment is left to era 4.
- **`e3-monclova`**: a first settlement on the site dates from the 1570s; 1689 is Alonso de León's refounding as
  Santiago de la Monclova (standard, but not confirmed in a fetched source).
- **`e3-fort-st-louis`**: the Handbook of Texas URL ("fort-st-louis") now only says the entry has moved; it was replaced
  with "La Salle's Texas Settlement", which also notes that "Fort St. Louis" is a later name and dates the Karankawa
  attack to about Christmas 1688–89. Coordinates of the excavated site on Garcitas Creek from Wikipedia; the geocoder hit is a
  marker at Inez, 19 km away, so this point is flagged as expected.
- **`e3-tejas-1690`**: the mission has not been found. It is marked at Mission Tejas State Park; the Handbook of Texas
  places it on San Pedro Creek a few kilometres west.
- **`e3-sierra-gorda`**: the five churches were built from about 1751 (Jalpan) to 1768 (Landa). Shown as 1750–1768,
  from Serra's arrival. The UNESCO page could not be fetched (HTTP 403), so it is cited without a URL.
- **`e3-chihuahua`**: dated 12 October 1709 (Real de San Francisco de Cuéllar); villa of San Felipe el Real 1718.
  Santa Eulalia's ores were first found in 1652; the rich strikes date from 1707.
- **`e3-parral`**: the strike is usually dated 1631 (some say 1629). Parral is called the "usual seat" of the
  governors because sources give different spans (1631–1739 or 1649–1739).
- **`e3-puebla`**: dated 1640–1649 for Palafox's years in Puebla; his library donation was in 1646.
- **`e3-queretaro`**: water reached the city on 22 October 1735 and the works were finished in 1738; the 1726 start is
  standard but not confirmed in a fetched source. City status is dated 1655 (Spanish Wikipedia) or 1656, so the
  description says "the mid-1650s".
- **`e3-jalapa-fair`**: set up under the Proyecto of 1720 and formally fixed at Jalapa by a royal order of 1728. The
  first fair was in 1720 or 1721. Shown as 1720–1776 (the last fleet). Fact-check: the description said free trade was
  decreed in 1778; the 1778 regulation did not apply to New Spain until 1789, and the description now says so.
- **`e3-cancuc`**: the description's last sentence ("Chiapas was then governed from Guatemala") implied a change of
  government; it now says the troops came from the Audiencia of Guatemala, which governed Chiapas. Shown as 1712–1713. The revolt is usually said to have begun in August 1712, but that was not
  confirmed in a fetched source.
- **`e3-tepehuan-revolt`**: no casualty total is given beyond "eight Jesuits and hundreds of settlers"; sources give
  about a hundred dead at each of Zape and Santiago Papasquiaro.
- **`e3-pima-revolt`**: began the night of 20 November 1751 at Sáric. "More than a hundred settlers" killed is the
  usual total but was not confirmed in a fetched source.
- **`e3-guadalajara`**: the cathedral was completed in 1618 but not consecrated until 1716 (some sources say
  consecrated 1618); the description says completed.
- **`e3-antequera-cochineal`**: the claim that cochineal was second only to silver among exports is standard for the
  eighteenth century.
- **`e3-veracruz-1683`**: the attack began on the night of 17–18 May 1683. How long the pirates stayed is given
  differently (days in the city, weeks offshore).
- **`e3-campeche-pirates`**: dated from the 1663 raid to the completion of the walls (1704). A raid of 1678 often
  mentioned in general sources was not confirmed and is left out of the description.
- **`e3-east-texas-missions`**: fact-check: the builder dated Guadalupe de los Nacogdoches to 1717; it was one of the
  four missions of 1716. The 1717 pair were Dolores de los Ais and San Miguel de los Adaes (Margil). Some sources date
  Dolores de los Ais to 1716.
- **`e3-san-saba`**: the Handbook counts 8 Spaniards (and 17 Indians) killed; the description now says "eight
  Spaniards".
- **`e3-pima-revolt`**: Tubac was called "the first Spanish settlement in what is now Arizona", but the missions of
  Guevavi and San Xavier came earlier; it is now "the first presidio".
- **`e3-pueblo-revolt`**: Po'pay was from Ohkay Owingeh and worked from Taos; the wording was clarified.
- **`e3-vizcaino`**: "renaming the bays" changed to "giving their present names to"; Monterey had no earlier
  Spanish name.
- **Sources**: Gerhard's pirates book is *Pirates on the West Coast of New Spain, 1575–1742* (1960; Dover reprint
  titled *Pirates of New Spain*). It covers the Pacific, so it is cited only for Acapulco. Veracruz and Campeche cite
  Juárez Moreno, *Corsarios y piratas en Veracruz y Campeche* (1972). Fact-check: confirmed in the Open Library
  catalogue (Sevilla: Escuela de Estudios Hispano-Americanos, Publicaciones no. 205, 1972, 468 pp.).

### Routes and lines

- **`e3-desague`**: schematic. It runs from Cuautitlán past Huehuetoca and through the Nochistongo hills; the last
  vertex is now El Salto (Tepeji del Río, Hidalgo, geocoded), where the cut discharges toward the Tula, but the
  alignment of the tunnel and the later open cut is not taken from a survey. Fact-check: the start of work is given as
  28, 29 or 30 November 1607, so only the month is shown; the tunnel was finished by May 1609; the 1637 decision to
  convert it to an open cut and its completion on 8 June 1789 (total length about 13 km) are confirmed (Spanish
  Wikipedia, "Tajo de Nochistongo", and a review article on the city's drainage on portal.amelica.org); the description now names the floods of 1604 and
  1607. The feature's end date
  (1789, completion of the Tajo de Nochistongo) is outside the era by design.
- **`e3-retreat-1680`**: main stops only.
- **`e3-camino-tejas`**: schematic. The road had many variants, especially between San Antonio and Nacogdoches, where
  two vertices are invented to keep it on land.
- **`e3-vizcaino`**: schematic coastal track with the main landfalls. The northern leg toward Cape Mendocino (January
  1603) is not drawn.

### Not mapped

- **Real de Catorce** is left out: its silver was discovered about 1772–73, which belongs to era 4.
- **Mérida** has no separate city feature in this era. Yucatán appears through Campeche and the Itzá conquest.
- **Martín de Ursúa's road** from Campeche to Petén (1695–97) is mentioned in **`e3-itza-conquest`** but not drawn; its
  route is not well enough documented to plot.
- **The 1701–02 Kino journeys** to the Colorado delta and the **Anza expeditions** (1774–76, era 4) are mentioned only.
- **La Bahía** (1722, moved to Goliad 1749) and the **Canary Islanders' villa of San Fernando** (1731) are mentioned in
  Texas features, not mapped separately.
- **The 1740 Yaqui–Mayo revolt**, the **1660 Tehuantepec rebellion** and the **1690s Tarahumara risings** are not
  mapped as separate features.
- **The galleon route** is drawn in era 2 and not repeated here.

### Sources

- A separate fact-checking pass checked dates against Wikipedia (en/es), the Handbook of Texas and NPS. It confirmed
  most book citations (Gerhard, Candiani, Hoberman, Cope, Deeds, Gradie, Jones, Gosner, Crosby, Bolton, Weddle,
  Chipman, Weber, Mathes, West, Osante, Schurz). Israel (1975), Spicer (1962), Brading (1991), Pérez de Ribas trans.
  Reff et al. (1999) and Juárez Moreno (1972) come from my own bibliographic knowledge.
- URLs used: Handbook of Texas entries (boundaries, la-salles-texas-settlement [replacing the moved fort-st-louis entry], san-juan-bautista, san-francisco-de-los-tejas-mission,
  san-antonio-de-valero-mission, los-adaes, santa-cruz-de-san-saba-mission, laredo-tx) and the NPS Camino Real de
  Tierra Adentro and Camino Real de los Tejas history pages. All were fetched and resolve.
- Geocoder cache trap: the cached result for "Jalpan de Serra, Querétaro, Mexico" in `.cache/geocode-v2.json` is
  wrong (about 24 km northeast of the town). **`e3-sierra-gorda`** therefore uses "Misión de Santiago de Jalpan".
- Fact-check of the geocoder cache: every point's cached display name was read and is the intended place (no
  namesakes), and the coordinates agree with known positions. The bad "Jalpan de Serra" entry is not used by any
  feature. All URLs were re-fetched and resolve; the "boundaries" entry supports the Medina (1721) and Arroyo Hondo
  (1736) lines but not the Nueces, which rests on Chipman.

### Book pass (Gillingham, *Mexico: A 500-Year History*)

Additions (‡ = book pass):

- **`e3-conspiracy-1612`**‡: dated to the hangings of 2 May 1612 (35 people, 28 men and 7 women, after Martínez 2004).
  The curfew and travel controls come from Gillingham (ch. 7); whether a plot existed is disputed, as the description
  says. Marked at the cathedral, beside the Zócalo point of `e3-flood-1629`.
- **`e3-yanga`**‡: Gillingham (ch. 7) does not name Yanga. He mentions, citing Townsend, a runaway settlement "near
  Puebla" that was allowed to survive if it took no more runaways; that is the known condition of the Yanga settlement,
  and the 1609 expedition marched from Puebla. The identification is mine. The span 1609–1630 runs from the campaign
  to the founding of San Lorenzo de los Negros (by about 1630, per Wikipedia's sources); the agreement is dated 1618 or
  later. The point is the modern town, not the 1609 palenque.
- **`e3-guadalupe`**‡: 1648–1754 (Sánchez's book to the papal confirmation of the patronage). The 1737 oath
  (27 April 1737) and the 40,157 dead (Cabrera y Quintero, quoted by Gillingham, ch. 2) are given in the text and note
  without a fetched source for the exact day; Poole and Brading are cited from bibliographic knowledge.
- **`e3-san-jose-del-cabo`**‡: founded 8 April 1730 (English Wikipedia, mission article). The galleon link follows
  Gillingham (ch. 6) and Crosby. The 1769 transit-of-Venus observation (Gillingham ch. 8; Nunis 1982) lies in era 4's
  years and is only mentioned.
- **`e3-nayar-1722`**‡: "January 1722" follows Rojas Galván (Historelo) and the introduction to Güereca Durán (2022);
  no source checked gives the day. The geocoder's "Mesa del Nayar" (Youque'E) is about 33 km west of the coordinates
  in Spanish Wikipedia (22.2153, −104.6517), which are used; the point is flagged by check-places for that reason.
  Some sources name the commander Juan Flores de la Torre.

- **`e3-cajonos-1700`**‡ (from agent A's handoff; Gillingham ch. 3 mentions only the bishop's amnesty "after a
  regional rebellion"): sequence of 14–16 September 1700 from English Wikipedia ("Martyrs of Cajonos"), which rests
  largely on the Church's account (Rosalba Piazza, *Historia Mexicana*, criticises that tradition); the fifteen
  executions and the 1704–05 surrender (104 towns, 99 calendar booklets and 4 of songs) from Tavárez's FAMSI report.
  Span 1700-09 to 1705-02. Gillingham's 37,000 Zapotecs differs from Tavárez's c. 60,000 people in all; noted.

- **`e3-yaqui-revolt-1740`**‡ (lead's follow-up, from agent C's handoff; Gillingham ch. 8): approximate, marked at
  Ráhum, home of Muni and Calixto. Start given only as 1740; the end is the execution of Muni and Bernabé at
  Buenavista on 23 June 1741, from a Jesuit letter summarised in the University of Arizona mission-records catalogue
  (fetched). Calixto's army, the flight to Álamos and Vildósola's victory "in August 1740" come from a secondary web
  summary (indigenousmexico.org, citing Deeds), so the text says "the second half of 1740". Hu-DeHart (1981), Meredith
  (1975) and Spicer (1962) are cited from bibliographic knowledge and were not read for this. Casualty figures (1,000
  Spaniards, over 5,000 Indigenous people, in that summary) are not used. `e3-yaqui-missions` still mentions the revolt
  in one sentence.
- **`e3-lombardo-1642`**‡ (optional item from the lead; Gillingham ch. 8): arrest 26 October 1642, death at the auto
  de fe of 19 November 1659, the 1650 escape and the content of the plan from English Wikipedia ("William Lamport"),
  which rests on Crewe (2010) and González Obregón (1908). Crewe is cited but was not read. Marked at the Inquisition
  palace, where he was held (approximate; the present building is from the 1730s).

Edits to existing features:

- **`e3-riot-1624`**: description now says the crowd cheered the king, Gelves escaped in disguise, and punishment was
  light (Gillingham chs. 7–8; consistent with Israel).
- **`e3-los-adaes`**: Aguayo is now described as a great Coahuila landowner (Gillingham ch. 6 gives the family's
  holdings as 25,000 square miles; not separately checked).
- Gillingham added as a source on `e3-desague`, `e3-riot-1624`, `e3-riot-1692`, `e3-pueblo-revolt`,
  `e3-santa-fe` (ch. 3, about 250 Spaniards c. 1630), `e3-yaqui-missions`, `e3-tepehuan-revolt`, `e3-parral`, `e3-acapulco-fair`, `e3-pericu-revolt`,
  `e3-antequera-cochineal`, `e3-veracruz-1683`, `e3-campeche-pirates`, `e3-puebla`, `e3-san-saba` (ch. 10, Comanche
  guns at the Wichita village in 1759) and `e3-los-adaes`, and on all additions.

### Differences from Gillingham

- **`e3-parral`**: Gillingham (ch. 6) dates the Parral strike to 1623; West and most sources give 1631 (some 1629).
  Kept 1631, noted.
- **`e3-tepehuan-revolt`**: Gillingham (ch. 3) dates the Tepehuán rising to 1617–18 and places it "in Chihuahua". It
  began on 16 November 1616 in the Durango sierra (Gradie, Deeds). Kept, noted.
- **`e3-riot-1692`**: Gillingham gives two different triggers, a woman dying in the crowd at the granary (ch. 8) and an
  Indigenous woman beaten to death (ch. 7), and twelve executions. Both are recorded in the note; the atlas text is
  unchanged.
- **`e3-desague`**: Gillingham (ch. 7) gives 60,000 drafted workers and a tunnel of about seven kilometres; the atlas
  says "thousands" and "some 6–7 km". The figure is noted, not adopted, as it was not checked in Candiani.
- **`e3-campeche-pirates`**: Gillingham (ch. 6) counts twelve attacks (1557–1708) and calls the Campeche dyewood
  indigo; it was logwood. Noted.
- **`e3-guadalupe`**: Gillingham (ch. 2) calls the 1736 epidemic cocoliztli; most sources call it matlazahuatl (probably
  typhus). The atlas uses matlazahuatl.

### Not mapped (book pass)

- **Sor Juana at the convent of San Jerónimo (1669–95)**, the **Inquisition's
  burnings (1665–1703)**, the **Aguascalientes court cases (1667, 1669)** and the **refounding of Aguascalientes with
  its Indian pueblo of San Marcos (1609)** are discussed in chs. 5, 7 and 8 but are not events at a place that help the
  geography; left out. The 1608 and 1611 conspiracy rumours are mentioned in `e3-conspiracy-1612`.
- **The marquisate of Aguayo's estates in Coahuila** (ch. 6) are mentioned in `e3-los-adaes`, not drawn.

## Era 4: Bourbon reforms (1760–1810)

### Territories

All fourteen territories are built from groups of modern states (`from_states`), so every edge follows a modern state
line, not a colonial one. They are marked approximate (intendancies, Tabasco) or schematic (Provincias Internas).

- **`e4-provincias-internas`** (dated 1776, the year of the royal order of 22 Aug 1776) uses Sonora, Sinaloa,
  Chihuahua, Durango, Coahuila, both Baja Californias, Texas, New Mexico, Arizona and California. It shows the claim,
  not Spanish control: most of Arizona, New Mexico, Texas and inland California was held by independent nations, and
  Alta California was only occupied from 1769.
  - Modern Texas overstates the province. Land south of the Nueces belonged to Nuevo Santander and Coahuila, and
    El Paso belonged to New Mexico. Modern California and Arizona have no colonial counterpart.
  - Saltillo and Parras (now Coahuila) only passed from Nueva Vizcaya to Coahuila in 1785. Nuevo León and Nuevo
    Santander, not in the 1776 command, joined the eastern command in 1786–93 and again from 1812–13.
  - The later divisions (three districts 1786; Oriente/Poniente 1787; reunited, seat to Chihuahua 1792–93; split again
    1813) are described, not mapped. These dates follow summaries of Navarro García and agree with Humboldt's
    c. 1804 arrangement (Nuevo León and Nuevo Santander then counted as "Provincias internas del Vireynato"), but
    they have not been checked against Navarro García (1964) itself.
- **Intendancies (`e4-int-*`)** are dated 4 Dec 1786 and show the Ordinance's assignments, not the c. 1804 arrangement.
  The Ordinance's article 1 (checked) names the twelve capitals; the district lists at the end of the Instrucción
  were not checked, so the assignments rest on Commons, Gerhard and Humboldt.
  - **`e4-int-mexico`**: México, Distrito Federal, Hidalgo, Morelos, Querétaro and Guerrero. Querétaro and the
    Guerrero coast from Acapulco to Zacatula did belong to it (Humboldt: "82 leagues from Acapulco to Zacatula").
    Overstated in eastern Guerrero (Tlapa and the Costa Chica belonged to Puebla) and in the Balsas Tierra Caliente
    (partly Valladolid). The Huasteca and Sierra Gorda edges are loose.
  - **`e4-int-puebla`**: Puebla and Tlaxcala. Tlaxcala separated in 1793. Its Pacific districts (Tlapa, Igualapa;
    Humboldt's "26 leagues" of coast) are not shown.
  - **`e4-int-veracruz`**: Veracruz only. Humboldt (c. 1803) counts Tabasco in this intendancy, but Tabasco is now
    shown separately (below).
  - **`e4-tabasco`**†: a separate *gobierno*, drawn from the modern state of Tabasco and dated 1787. Its governor
    answered to the viceroy and the Audiencia of Mexico in political and military matters; from 1787 it was attached
    to the intendancy of Mérida for treasury (hacienda) matters only, as a subdelegación. This follows
    Jiménez Abollado (2024), who cites Gerhard; Gerhard's *Southeast Frontier* itself was not available to check.
    Humboldt's inclusion of Tabasco in Veracruz is the main conflicting account.
  - **`e4-int-merida`**: Yucatán, Campeche and Quintana Roo. The interior was barely administered, and Belize is not
    represented.
  - **`e4-int-valladolid`**: Michoacán and Colima, derived again from the state outlines (the derive script now drops
    the Revillagigedo Islands; the result is identical to the hand-frozen outline). Colima moved to Guadalajara in
    the 1790s; sources give c. 1790 or 1795.
  - **`e4-int-guadalajara`**: Jalisco, Nayarit and Aguascalientes. Aguascalientes was assigned to Guadalajara in
    1786; the Junta Superior de Real Hacienda moved it to Zacatecas in 1789, but the dispute was only settled in
    1803–04 (Humboldt still lists it under Guadalajara).
  - **`e4-int-zacatecas`**: Zacatecas only (see Aguascalientes above).
  - **`e4-int-san-luis-potosi`**: San Luis Potosí, Nuevo León and Tamaulipas.
    - Humboldt counts Coahuila and Texas in this intendancy (as "Provincias internas de la Comandancia general
      Oriental"), but they are shown with the Provincias Internas, so their tie to San Luis is not mapped.
    - Nuevo Santander ran north to the Nueces, beyond modern Tamaulipas.
    - Nuevo León and Nuevo Santander were themselves in the Provincias Internas in 1786–93 and from 1812–13, so this
      polygon overlaps the history of `e4-provincias-internas`.
  - **`e4-int-durango`**: Durango and Chihuahua (Nueva Vizcaya). El Paso was New Mexico's, and the Bolsón de Mapimí
    was Apache country.
  - **`e4-int-arizpe`**: Sonora and Sinaloa. The Pimería Alta (Tubac, Tucson) lay in modern Arizona and is not
    included.
  - **`e4-int-oaxaca`** and **`e4-int-guanajuato`** match their modern states closely.
- The intendancy of Durango and the intendancy of Arizpe overlap `e4-provincias-internas` by design.

### Dates and places

- **`e4-galvez-visita`**: 1765–1771. Sources disagree on whether Gálvez left in 1771 or 1772. Marked at Mexico City.
- **`e4-tobacco-factory`**: the monopoly was ordered in 1764 and set up from 1765. The point is at La Ciudadela,
  which was built for the factory from 1793 and finished in 1807. "Several thousand" workers is deliberately vague.
- **`e4-jesuit-expulsion`**: 25 June 1767 is the usual date. One source gives 24 June for the opening of the
  sealed orders in Mexico City. No head count is given (figures of ~680 circulate). The exiles went via Havana and
  Spain to Italy (first Corsica, then the Papal States).
- **`e4-loreto-1768`**: given to the month (the Jesuits sailed on 3 Feb 1768 by most accounts).
- **Riots**:
  - **`e4-riot-san-luis-de-la-paz`**: 25 June (commissioners driven out) to 20 July 1767 (four ringleaders executed),
    from Priestley.
  - **`e4-riot-san-luis-potosi`**, **`e4-riot-guanajuato`** and **`e4-riot-patzcuaro`**: dated to the year. The
    Guanajuato sentences (6 Nov 1767: 9 death sentences and about 180 others) and the Pátzcuaro/Uruapan trials held at
    Valladolid in November are from Priestley.
- **`e4-sonora-expedition`**: 1767–1771, marked at Guaymas, the base. The Cerro Prieto fighting was inland, and
  that site is not located.
- **`e4-san-blas`**: dated 1768. Sources give 1767, 1768 or 1770 for the port and naval department.
- **`e4-presidio-line`**: dated to the royal cédula of 10 Sep 1772 (one source gives 1 Sep, probably OCR).
- **`e4-los-adaes`**: the residents were told to leave in June 1773 (Handbook of Texas). The Handbook says the ~500
  people did not stay in San Antonio but returned east; the 1779 founding of Nacogdoches rests on Weber.
- **`e4-catorce`**: the settlement was founded in 1772 and the vein found the following August (INAH). Start is 1772.
- **`e4-valenciana`**: start 1768 is soft. Sources say only that production rose sharply in 1768 or in the late
  1760s. "One of the richest silver mines in the world" is used instead of "the richest".
- **`e4-tucson`**: 20 Aug 1775 is the site selection; the garrison moved in 1776 and 1777 by different accounts.
- **`e4-arizpe`**: 12 Jan 1780 (the bando naming Arizpe capital) to 1793 (Nava moves to Chihuahua). This follows
  Spanish Wikipedia, which itself contradicts its infobox on the later seats.
- **`e4-yuma-1781`**: 17–19 July 1781. Death tolls range from about 50 to more than 100, so the text says "dozens".
  It is marked at the Purísima Concepción hill (Fort Yuma); Bicuñer is not mapped separately.
- **`e4-comanche-peace`**: Feb 1786 at Pecos, with 28 Feb in some accounts. The NPS says 28 Feb was the date of the
  Ute–Comanche understanding, and one account puts the signing on the Arkansas. Marked approximate.
- **`e4-consulado-veracruz`**: now dated 17 Jan 1795 (royal cédula; installed 25 Apr 1795), from Souto Mantecón
  (2006). The road the consulado funded (Veracruz–Xalapa–Perote) is mentioned loosely; Humboldt confirms a new
  causeway Perote–Xalapa begun "within these few years" but does not name the builder.
- **`e4-consolidacion`**: 26 Dec 1804 (the cédula for America) to 8 Oct 1808 (formal suspension in New Spain), both
  from von Wobeser. "More than any other part of the empire" also rests on von Wobeser and the general literature.
- **`e4-coup-1808`**: the night of 15 Sep 1808. Some accounts say the early hours of 16 Sep.

### Routes

- **`e4-galvez-repression`**: now follows Priestley's dated itinerary: Mexico City (left 9 July 1767), San Luis de la
  Paz, San Luis Potosí (to 11 Oct), Guanajuato (16 Oct–11 Nov), Valladolid (from 14 Nov), back to Mexico City
  (24 Nov). Gálvez did not go to Pátzcuaro; the Pátzcuaro prisoners were tried in Valladolid. The totals
  (85 executed, 73 flogged, 674 imprisoned, 117 banished) are Priestley's.
- **`e4-portola`**: the San Diego → Sweeney Ridge leg only. The approach from Velicatá and the return are not drawn.
  Intermediate waypoints are modern cities on the coast route, not documented camps.
- **`e4-anza`**: drawn from Tubac. Earlier assembly at Culiacán and San Miguel de Horcasitas is not drawn.
  - The Coyote Canyon waypoint is at Borrego Springs.
  - The Colorado crossing date is not given (sources differ).
  - The line ends at the San Francisco presidio, and the end date is the colonists' arrival on 27 Jun 1776 (NPS).
- **`e4-humboldt`**: schematic.
  - The Acapulco → Chilpancingo → Taxco → Cuernavaca → Mexico City leg and the Bajío loop (Guanajuato, Valladolid,
    Pátzcuaro, Jorullo, Toluca) are reconstructed from his known visits, not from a day-by-day itinerary.
  - Querétaro and Real del Monte are omitted.
  - The landing date is 22 or 23 Mar 1803 (22 is used).
- **`e4-presidio-line`**: an indicative line through eight well-located presidios, not the fifteen of the plan. The
  relocations of 1773–75 are not drawn.

### Not mapped

- **Nootka crisis (1789)**: Nootka Sound (~49.6°N) lies outside the atlas's coordinate box (north edge 46°N). It is
  mentioned in `e4-san-blas`.
- **Rubí's inspection (1766–68)** and **O'Conor's relocations**: mentioned in `e4-presidio-line`, not drawn as routes.
- **Other tobacco factories** (Puebla, Oaxaca, Orizaba, Querétaro, Guadalajara): listed in `e4-tobacco-factory`,
  not mapped separately.
- **Other Alta California foundations** (San Gabriel 1771, San Luis Obispo 1772, San Juan Capistrano 1776, San José
  1777, Santa Barbara 1782): left out to avoid clutter, except Los Ángeles. San José is mentioned there.
- **Jesuit colleges** other than the Colegio Máximo (Tepotzotlán, Puebla, the Sonora missions): not mapped.
- **Militia reform (1764 onward), the Academy of San Carlos, the Mining Tribunal and Mining College, and the free-trade
  regulation of 1778/1789**: not separately mappable. The last is mentioned in `e4-consulado-veracruz`.
- **Gutiérrez–Magee and other 1810s events**: these belong to era 5.

### Book pass (Gillingham, *Mexico: A 500-Year History*)

Additions (‡ = book pass):

- **`e4-canek-1761`**‡: 19 November (the crowning and killing of the merchant, as dated by the trial record cited by
  Patch) to 14 December 1761 (executions). The assault of 26 November, "more than 500" attackers and "more than 500"
  Maya dead are Patch's figures. That the village was burned follows English Wikipedia and Gillingham (who says razed);
  Patch does not say. Gillingham spells it Quisteil.
- **`e4-real-del-monte`**‡: Gillingham never names the 1766 strike; he says Romero drove free workers to rebellion
  (ch. 6) and that mine owners called troops against strikers (ch. 8). The strike dates (28 July 1766 onward) and the
  15 August killings are from English Wikipedia's article based on Ladd (1988), not from Ladd directly. The Count of
  Regla title (1768) and the Monte de Piedad (1775) are standard but were not checked in a fetched source; the gift of
  warships is from Gillingham (ch. 4, "two 112-gun ships of the line"). Span 1766–1775 follows Ladd's title.
- **`e4-teotitlan-1796`**‡: 8 October 1796 and the details of the infirmary and burials are from Aguilera-Núñez (2023),
  read in full; Ramírez (2012) is cited from its abstract and bibliographic record.

Edits to existing features:

- **`e4-provincias-internas`**: Teodoro de Croix is now identified as the nephew of the former viceroy, the Marqués de
  Croix (Gillingham ch. 8; standard).
- **`e4-coup-1808`**: description now names Pedro Garibay as the viceroy installed by the coup (Gillingham ch. 8;
  standard).
- Gillingham added as a source on `e4-galvez-visita`, `e4-tobacco-factory`, `e4-jesuit-expulsion`, the four 1767 riot
  points, `e4-galvez-repression`, `e4-provincias-internas`, `e4-presidio-line`, `e4-catorce`, `e4-valenciana`,
  `e4-comanche-peace` (ch. 10), `e4-humboldt`, `e4-consolidacion`, `e4-coup-1808`, `e4-san-blas` (ch. 10, Nootka) and
  all additions.

### Differences from Gillingham

- **`e4-galvez-repression`**: Gillingham (ch. 8) gives eighty executions; Priestley's count, used in the description,
  is 85. Noted.
- **Guadalajara, 1767**: Gillingham (ch. 8) names "1767 in Guadalajara" among the three great urban riots of the
  colony. Priestley, Castro Gutiérrez and Gillingham's own account of 1767 place the risings in San Luis Potosí,
  Guanajuato, Michoacán and San Luis de la Paz. No Guadalajara riot is mapped; the point is noted on
  `e4-galvez-repression`.
- **`e4-galvez-visita`**: Gillingham (ch. 8) dates Gálvez's ministry 1777–1786; the atlas keeps 1776 (Navarro García).
  He died in office in 1787. Noted.
- **`e4-jesuit-expulsion`**: Gillingham (ch. 8) gives 678 Jesuits; the atlas says "several hundred". Noted.
- **`e4-valenciana`**: Gillingham (ch. 4) calls the Rayas mine the world's largest around 1800; Humboldt and Brading
  put the Valenciana first. Noted.
- **`e4-teotitlan-1796`**: Gillingham (ch. 8) says the rioters were not seriously punished and won; Aguilera-Núñez says
  the ringleaders were flogged and jailed and the patients returned to the infirmary. Both are in the note.
- Gillingham dates the first general census to 1790 (ch. 8) and 1793 (ch. 7); the Revillagigedo census ran 1790–93.
  Not mapped.

### Not mapped (book pass)

- **The vaccination expedition of 1804** (Real Expedición Filantrópica de la Vacuna, ch. 8): its itinerary in New Spain
  (Yucatán, Veracruz, Mexico City, Acapulco) was not checked well enough to draw; left out.
- **The famine of 1785–86** (ch. 8) affected the whole plateau and has no single site.
- **Archaeological expeditions** to Palenque (1773) and Xochicalco (1777), the **1769 transit of Venus** at San José
  del Cabo (mentioned in `e3-san-jose-del-cabo`), the **conspiracies of 1794 and 1799 (machetes)** in Mexico City, and
  the **Durango (1800) and Tepic (1801, "indio Mariano") plots** are passing mentions in ch. 8; left out.
- **The Hacienda de Charco de Araujo** (Guanajuato, 1796–99, ch. 7) could not be located with confidence; left out.

## Era 5: War of Independence (1810–1821)

### Territories

- **`e5-guerrero-south`**: the only territory, hand-drawn (14 vertices, `clip: "land"`) and schematic.
  - It is anchored on Huetamo, Teloloapan, Chilpancingo, Tecpan and Zihuatanejo. The insurgents held no fixed
    territory, Acapulco and most towns stayed royalist, and the outline only shows the kind of country (Sierra Madre
    del Sur, Balsas Tierra Caliente) where Guerrero survived.
  - Dated 1816 to Feb 1821.

### Dates and places

- **`e5-queretaro-conspiracy`**: 13 Sep 1810. Sources date the denunciation and warnings 13–15 Sep.
- **`e5-monte-de-las-cruces`**: placed at La Marquesa, at the head of the pass. The fighting extended along the road,
  and the royalist strength (~2,500) is the usual figure. The retreat is now given as "early November" (sources give
  1–3 Nov).
- **`e5-aculco`**: placed at the town; the battle was on the adjacent hills.
- **`e5-chihuahua-executions`**: placed at the Palacio de Gobierno (site of the former Jesuit college). Hidalgo's cell
  is in the neighbouring Palacio Federal; the two are within 200 m.
- **`e5-cuautla`**: 19 Feb–2 May 1812. Spanish Wikipedia's body text gives 9 Feb and 63 days; other sources give 72
  or 58 days. The usual 19 Feb is kept, and no length is given.
- **`e5-acapulco-1813`**: April–August 1813. The fort's capitulation is usually dated 20 Aug, but only the month is
  shown.
- **`e5-chilpancingo`**: the congress was installed on 13 Sep (some sources say 14 Sep) and declared independence on
  6 Nov 1813. Accounts differ on whether the Sentimientos were read on the 13th or the 14th.
- **`e5-valladolid-1813`**: now 23–25 Dec 1813; Llano's report refers to actions on the 23rd, 24th and 25th.
- **`e5-puruaran`**: now 5 Jan 1814, from Ciriaco del Llano's report to Calleja (Valladolid, 20 Jan 1814), which is
  headed "Batalla de Puruarán dada el 5 de enero de 1814". Some secondary accounts give 4 Jan.
- **`e5-temalaca`**: marked at Temalac, Atenango del Río, Guerrero (approximate).
  - Manuel de la Concha's detailed report (Tepecuacuilco, 13 Nov 1815) says Morelos crossed the river by the ford at
    Atenango and rested at "Temalaca", six leagues from where Concha crossed (he came via Tulimán, ~30 km west of
    Temalac, which fits), and that the fighting was on the hills beyond the village on the road to "Coesala"
    (Cohetzala, Puebla, ~19 km northeast).
  - So the battle and capture were probably a few kilometres northeast of Temalac, near the modern Guerrero–Puebla
    line. That would explain why SEDENA, Memórica and many others say "Temalaca, Puebla"; OpenStreetMap has no place of
    that name in Puebla, and the 2013 bicentennial reporting and Temalac's local chronicler place it at Temalac.
  - The exact hill and cañada where Carranco took Morelos are not located.
- **`e5-medina`**: no `modern_place`. The Handbook of Texas puts the battle "twenty miles south of San Antonio" and
  says research in the 2010s placed the battlefield and burials in northern Atascosa County near the old Pleasanton
  Road; the point (~35 km south of downtown San Antonio) is placed by hand there. Treat it as within ~10 km.
- **`e5-cadiz-constitution`**: now 30 Sep 1812 (reading and oath in the Real Palacio, Guedea ch. 4) to 1814.
- **`e5-victoria`**: 1815–1816 only. Sources differ on when Victoria lost Puente del Rey and Boquilla de Piedras.
  Boquilla de Piedras did not geocode and is not mapped.
- **`e5-soto-la-marina`**: 15 Apr 1817 (the landing). CNDH gives 21 Apr for the occupation of the town.
- **`e5-sombrero`**:
  - Marked at Comanja de Corona; the fort's hill is nearby but was not geocoded.
  - Spans June to 11 Nov 1817 (Mina's execution near Los Remedios). Los Remedios, Venadito and the Cerro del Bellaco
    are not mapped separately.
- **`e5-acatempan`**: the "abrazo" of 10 Feb 1821 is traditional, and both its date and whether it happened are
  debated. Marked approximate.
- **`e5-trigarante-entry`**: "some 16,000 men" is the commonly cited strength.
- **Unconfirmed details.** Several descriptive details rest on the standard narrative (Alamán, Hamill, Timmons) and
  were not each re-checked online:
  - the cathedral funds taken at Valladolid;
  - the Spanish prisoners executed in Guadalajara;
  - the burning of tobacco stores at Orizaba;
  - the insurgents firing on each other at Valladolid in 1813;
  - that Morelos fought at Temalaca to cover the congress's escape (Concha's report describes the battle but not
    Morelos's purpose).

### Routes

All routes put vertices only at geocoded towns. The roads between them are not traced.

- **`e5-hidalgo-advance`**: the leg from Celaya to Guanajuato is drawn straight. The real road went via Salamanca and
  Irapuato. Charo is included as the place where Hidalgo commissioned Morelos (20 Oct).
- **`e5-hidalgo-retreat`**: Hidalgo's line only, via Acámbaro to Valladolid and then straight to Guadalajara. Allende's
  route to Guanajuato is omitted.
- **`e5-hidalgo-north`**: the Zacatecas → Matehuala → Saltillo leg is reconstructed.
- **`e5-prisoners`**: Baján → Monclova → Chihuahua, schematic. The desert route is unknown in detail.
- **`e5-morelos-first`**: the coastal leg (Huetamo → Zihuatanejo → Petatlán → Tecpan) follows Spanish Wikipedia's
  narrative. The inland swing to Chilpancingo, Tixtla and Chilapa runs May–Aug 1811. The Huetamo vertex was ~26 km
  west of the town and has been moved to Huetamo de Núñez (also in `e5-morelos-fourth`).
- **`e5-morelos-second`**: Chilapa → Tlapa → Chiautla → Izúcar → Cuautla. The Taxco/Tenancingo excursion is omitted.
  The Chiautla vertex is within ~2 km of the town (the geocoder returned a nearby road).
- **`e5-morelos-third`**: it returns to Tehuacán between Orizaba and Oaxaca.
- **`e5-morelos-fourth`**: the most schematic. The coastal leg Oaxaca → Ometepec → Acapulco and the leg Chilpancingo →
  Huetamo → Valladolid are reconstructions; Huetamo is only an indicative waypoint.
- **`e5-mina-march`**: the stops (Valle del Maíz, Peotillos, Real de Pinos, Comanja) follow Robinson's narrative. I
  could not confirm the dates online, so the route runs from May 1817 to 24 Jun 1817, the date he joined Pedro Moreno.
- **`e5-iturbide-1821`**†: schematic; Iturbide's own movements only, from Orozco Piñón (2022), which is based on his
  correspondence in the AHSDN. Dated stops: Cutzamala (25 Mar), Acámbaro (2 May), Valladolid (besieged from 12 May,
  capitulated 20 May), San Juan del Río (16 Jun), Querétaro (capitulated 28 Jun), Puebla (capitulated 28 Jul), Texcoco
  (HQ in August), Córdoba (24 Aug), Puebla (31 Aug), Mexico City (27 Sep). Teloloapan, Tlalchapa, Huetamo, Tuzantla and
  Zitácuaro are the stops the chapter names, undated. Arroyo Zarco (14 Jul) is omitted, and the line from Texcoco to
  Córdoba and back through Puebla is assumed.

### Not mapped

- **Ignacio López Rayón's forts** (Cóporo), **the Junta of Jaujilla**, **Los Remedios**, **Pedro Moreno's death**,
  and **the Siege of Cóporo**: left out to keep the map readable.
- **The campaigns of Iturbide's subordinates in 1821** (Bustamante and Cortazar in the Bajío, Bravo and Herrera in
  Puebla, Santa Anna at Xalapa and Veracruz, the battle of Azcapotzalco on 19 Aug): not drawn.
- **Hidalgo's degradation and the Inquisition trial of Morelos** in Mexico City: mentioned in the descriptions only.
- **The 1820 restoration of the Cádiz Constitution**: mentioned in `e5-cadiz-constitution`, not mapped separately.
- **The Act of Independence (28 Sep 1821)**: mentioned in `e5-trigarante-entry`. Era 6 begins with Iturbide's empire,
  so nothing here is duplicated.
- **The Gutiérrez–Magee capture of San Antonio and its declaration of Texas independence (Apr 1813)**: mentioned in
  `e5-medina`, not mapped separately.

### Book pass (Gillingham, *Mexico: A 500-Year History*, chs. 8–9)

- Gillingham (ch. 9, and ch. 8 for Riaño's granary and Venegas) is now cited on the features he discusses. No features were
  added: the book's Independence narrative (Dolores, the Alhóndiga, Monte de las Cruces, Calderón, Baján, Zitácuaro,
  Cuautla, Oaxaca, Acapulco, Chilpancingo, Apatzingán, Morelos's death, Iguala, Córdoba) is already mapped.
- **`e5-chilpancingo`**: the description now gives the congress's own name, the Congress of Anáhuac, which the book uses.
- **`e5-cuautla`**: one sentence added, attributed to Gillingham, tracing the 1813 typhus epidemic (some 40,000 dead in
  the Valley of Mexico, he says) to the siege armies. Not checked against a second source, so it is worded as his claim.
- **`e5-dolores`**: note on Venegas, who took office in Mexico City on 14 Sep 1810 (several biographical sources; one
  says 13 Sep). From agent B's handoff.

### Differences from Gillingham

- **`e5-dolores`**: Gillingham has Aldama reaching Dolores at 2 a.m. and Hidalgo ringing the bell at eight; the atlas
  keeps the usual "before dawn" and gives his version in the note.
- **`e5-morelos-third`**: Gillingham lists Xalapa among the cities Morelos captured. The Morelos biographies the atlas
  uses (Timmons, Lemoine) record Orizaba and Oaxaca but no capture of Xalapa, so it is not mapped and no note was added.
- **Cádiz deputies**: Gillingham names Lucas Alamán among New Spain's deputies at Cádiz; Alamán sat in the Cortes of
  1820–21, not the constituent Cortes of 1810–12. Not in the atlas, so nothing changed.

### Not mapped (book pass)

- The 1813 typhus epidemic and the war's demographic cost (Gillingham: up to 600,000 dead, one Mexican in ten) are
  national, not place events; they are suggested for the era summary instead.
- The Guadalupes of Mexico City, the 1812 municipalities created under Cádiz (36 in 1812, 630 by 1821, a third of them in
  Oaxaca), and Iturbide's command in the Bajío (1813–16): mentioned in the book, not mappable as single points.

## Era 6: Early republic and territorial loss (1821–1854)

### Treaty lines

- **`e6-adams-onis-line`**: built from Art. III.
  - The segment from the source of the Arkansas north to 42°N follows the treaty's contingency clause and was
    never surveyed.
  - The treaty's 100th meridian came from the Melish map and differs slightly from the true meridian.
  - River sections use modern geometry (the Texas border along the Sabine and Red; Natural Earth for the
    Arkansas), not the banks specified in the treaty.
- **`e6-guadalupe-hidalgo-line`**: the southern boundary of New Mexico is drawn at 32°22′N for three degrees west
  of the Rio Grande, then north to the Gila, as in the Bartlett–García Conde compromise (1850–51).
  - That compromise was never implemented by the US, so this segment is the least certain part of the 1848 line.
  - The Rio Grande follows the modern border and has since shifted (cf. the Chamizal dispute).
- **`e6-gadsden-line`**: follows the treaty corners (31°47′, 100 miles west, 31°20′, 111th meridian, 20 miles
  below the Gila junction). Its northern counterpart inherits the 1848 uncertainty, so
  **`e6-gadsden-purchase-1853`** is marked approximate.

### Territories

- **`e6-mexico-1821`**: claimed, not controlled.
  - The southern edge uses the modern Guatemala and Belize borders (fixed 1882/1893), so it includes Chiapas,
    which only joined Mexico in 1822–24.
  - Soconusco stayed disputed until 1842.
- **`e6-central-america-1822`**: uses modern borders; the British settlements in Belize and on the Mosquito Coast
  are not represented.
- **`e6-texas-claim-1836`**: drawn to the 1836 act (Rio Grande to its source, then north to 42°N). The Compromise
  of 1850 is mentioned in the description but not mapped.
- **`e6-nueces-strip`**: the western closure from the Nueces headwaters to the Rio Grande is schematic.
- **`e6-cruzob-territory`**: the rebel Maya frontier moved constantly and was never surveyed; the outline is only
  indicative.

### Points and dates

- **`e6-thornton`**: placed at the National Park Service location for Rancho de Carricitos. The exact site is
  uncertain, and NPS gives 24 April while most sources give 25 April 1846.
- **`e6-sacramento`**: roughly 25 km north of Chihuahua City, placed approximately.
- **`e6-resaca`**, **`e6-molino-del-rey`** and **`e6-velasco`** are placed from historical markers and
  descriptions, not from surveyed sites, so treat them as approximate.
- **`e6-constitution-1824`**: marked at the former church of San Pedro y San Pablo, where the Constituent
  Congress met.
- **`e6-kearny`**: the army left Fort Leavenworth in detachments in late June 1846; Kearny's own departure date
  varies between sources.
- **`e6-yucatan-secession`**: shown only as 1841–1848; the separation went through several declarations and
  reunions.
- **`e6-valladolid-1848`**: evacuated in March 1848; sources differ on the day.
- **`e6-republic-rio-grande`**†, **`e6-texan-santa-fe-expedition`**† and **`e6-walker-filibuster`**†: given to
  the month.

### Routes

- **`e6-santa-fe-trail`**: only the Cimarron route is drawn, and the desert section is schematic.
- **`e6-doniphan`**: the leg from Chihuahua to Parras is schematic.
- **`e6-comanche-raids`**†: one representative corridor (the Great Comanche War Trail via Comanche Springs and the
  Big Bend). Raiding also crossed the lower Rio Grande, and Apache raiding hit Sonora and Chihuahua.

### Book pass (Gillingham, chs. 9–11) ‡

Features added in the book pass are marked ‡. Gillingham is cited on the existing features he discusses.

- **`e6-casa-mata-1823`**‡: Santa Anna's December 1822 revolt and the Plan of Casa Mata (1 Feb 1823) to the abdication
  (19 Mar 1823). Marked in Veracruz city; the powder magazine stood outside the walls and is not located. The day of
  Santa Anna's December rising (usually 2 Dec) was not confirmed, so the start is given to the month.
- **`e6-padilla-1824`**‡: Iturbide's execution, 19 Jul 1824. Marked at modern Padilla; the old town was drowned by the
  Vicente Guerrero reservoir (1970–71). Sources differ on the hour and on whether he was shot in the plaza, in front of
  the church or at the barracks. Landing 14 Jul (one source says arrest on the 16th).
- **`e6-ulua-1825`**‡: the Spanish garrison of San Juan de Ulúa, 26 Oct 1821 – Nov 1825 (INAH bulletin 588). The
  capitulation is dated 17 Nov (INAH), 18 Nov (a Veracruz plaque) or 5–6 Nov (Barragán's demand); the handover and flag
  raising are usually 23 Nov, the end date used. Nudged ~130 m from `e6-pastry-war`.
- **`e6-yaqui-banderas`**‡: 1825 – 23 Jan 1833 (execution at Arizpe, Dedrick in *Tlalocan*, citing Bancroft and
  Spicer). Marked at Ráhum, which Dedrick calls the movement's meeting place. Banderas's ally Dolores Gutiérrez and the
  final battle (Soyopa, Dec 1832, in some accounts) are left out because only weak sources give them. The peace that
  "secured the valley" is Gillingham's claim.
- **`e6-guerrero-cuilapan-1831`**‡: capture at Acapulco 14 Jan 1831 and execution at Cuilapan 14 Feb 1831 (CNDH).
  Marked at the former convent, approximate.
- **`e6-fort-ross`**‡: 1812 – 20 Dec 1841 (California State Parks; bill of sale). Dated before the era on purpose
  (validator warning accepted), since it is in the book's ch. 10 as a Mexican-era vulnerability.
- **`e6-jones-monterey-1842`**‡: 19–21 Oct 1842 (local history column and Wikipedia's account of Smith's biography; one
  account puts the landing on the 20th). Marked at the Presidio of Monterey (castillo site), ~2 km from the Custom House
  point of `e6-monterey-ca`. The size of the landing party (about 150) is not given because only Wikipedia states it.
- **`e6-sierra-gorda-1847`**‡: Aug 1847 – 1849. Marked at Xichú, where deserters began the revolt. The book speaks of the
  Huasteca and Morelos; the Sierra Gorda rising (adjoining the Huasteca) is the best-documented of these peasant wars and
  stands in for them. The end is given as 1849 only: Ramírez Casas has the rebel chiefs dead by October 1849; other
  accounts date Quiroz's execution to December 1849.

### Differences from Gillingham

- **`e6-constitution-1824`**: Gillingham counts 19 states, 5 territories and a federal district; the constitution named
  4 territories, with Tlaxcala and the Federal District settled by decrees of November 1824. Noted.
- **`e6-barradas`**: Gillingham dates Santa Anna's attack on the stockade to 7 Sep 1829; the feature keeps the surrender
  of 11 Sep. Noted. His figure of 3,500 men is attributed to him in the description.
- **`e6-taylor`**: Gillingham dates the occupation of the Nueces Strip to 13 Jan 1846 (Polk's order); the army left
  Corpus Christi on 8 Mar. Noted.
- **`e6-thornton`**: Gillingham gives 12 May for the declaration of war (Senate vote); Polk signed it on 13 May. Noted.
- **`e6-monterrey`**: Gillingham 20–23 Sep 1846; atlas 21–24 Sep. Noted.
- **`e6-veracruz-1847`**: Gillingham has the garrison surrendering on 26 Mar; the atlas has capitulation 27 Mar and
  occupation 29 Mar. Noted.
- **`e6-fort-ross`**: Gillingham 1811–1839; atlas 1812–1841. Noted.
- **`e6-jones-monterey-1842`**: Gillingham gives September 1842, 800 men and "Monterrey"; atlas October 1842. Noted.
- **`e6-mexican-cession-1848`**: Gillingham says gold was found eight days before the treaty; the atlas's nine days
  (24 Jan to 2 Feb) is kept, with no note (trivial).
- **`e6-san-jacinto`**: Gillingham says the battle lasted "less than an hour"; the atlas's "under twenty minutes" (Handbook
  of Texas) is not contradicted. No note.
- Book statements not reflected on the map: a US naval force "landed at Mazatlán and marched up the Pacific Coast" in
  1846 (Mazatlán was occupied only in November 1847); Doniphan's reprisals "on their march to Santa Fe" (his march ran
  from Santa Fe south to Chihuahua). Neither is in the atlas.

### Not mapped (book pass)

- **Plan del Hospicio (Guadalajara, 20 Oct 1852)** and Santa Anna's last dictatorship: the book mentions them in a
  sentence; the place of proclamation could not be confirmed from an accessible source.
- **Manga de Clavo**, Santa Anna's hacienda and power base near Veracruz; **Francisco Sentmanat** in Tabasco
  (1840s); **the Fredonian rising** at Nacogdoches (1826); **the expulsions of Spaniards** (1827, 1829); **Arista's looting
  of the Guanajuato mines** (1833); **British mining companies** (e.g. Real del Monte); the four battles of the **1832
  civil war**; **James Kirker's** scalp-hunters (1839). Passing mentions.
- **The rising of Mexico City against the occupiers (14–15 Sep 1847)**, which the book describes at length, is in
  `e6-mexico-city-1847` ("fought the occupiers in the streets"); not a separate feature.

## Era 7: Reform and French Intervention (1854–1876)

- Fact-checked after the build. Features added in that pass are marked †.

### Territories

- **`e7-nuevo-leon-coahuila`**: drawn as the two modern states, from Vidaurri's annexation of 19 Feb 1856 to Juárez's Saltillo decree of 26 Feb 1864. Both dates, and the union's recognition in the 1857 Constitution, are confirmed by the Nuevo León Congress archive. The outer lines are modern. The customs-revenue quarrel and Vidaurri's later service to the empire come from Tyler and the standard accounts, not from that archive page.
- **`e7-campeche-1863`**: the modern state of Campeche; its eastern and southern limits in the 1860s were nominal.
  - The dates follow Sánchez Ulloa (*Secuencia*, 2023): the movement began in August 1857, the division was agreed in May 1858, and Campeche became a state constitutionally in April 1863.
  - The feature is dated to the constitutional amendment of 29 April 1863. It was not a decree by Juárez, as the builder's text had it.
  - Juárez's provisional recognition of 19 February 1862 comes from secondary web sources only, so the description says "1862".
- **`e7-hidalgo-1869`** (16 Jan 1869): Juárez's promulgation date. Secondary sources put the congressional decree on 15 January. The decree text was not seen.
- **`e7-morelos-1869`** (17 Apr 1869): checked against the decree text published by the Morelos government. Congress passed it on 16 April and Juárez promulgated it on 17 April. It made the five districts of the "third military district" of 7 June 1862 into the state.
- **`e7-republic-1865`**†: a schematic MultiPolygon of three areas that sources describe as republican in October–December 1865. It is clipped to modern Mexico.
  - **Paso del Norte and the Rio Grande** (INAH). Chihuahua City is excluded.
  - **The Costa Chica of Guerrero under Juan and Diego Álvarez.** The source is Díaz's memoirs, ch. LII, on his visit to La Providencia between 10 October and 20 November 1865. Acapulco, imperial from 11 September 1865, is excluded.
  - **Tabasco and Chiapas under Gregorio Méndez.** Méndez's letter of 2 February 1866 (FRUS 1866) and Zubirán (INEHRM, 2016) support it.
  - **No standard map.** None of the standard histories available online maps the republic's territory at its low point. The widely reproduced Wikipedia map of the empire "at its apogee" has no stated basis and was not used.
  - **Left undrawn.** The Sierra Norte de Puebla, the Huasteca, the Tamaulipas–Nuevo León countryside, Michoacán and Sinaloa were contested guerrilla country rather than held territory. They are named in the description and note but not drawn.
  - **Edges.** The Guerrero ring's inland edge and the decision to include all of Chiapas are judgment calls.
  - **Unchecked sources.** The relevant passages in Bazant, Hamnett, Cunningham, Ridley and Meyer/Sherman/Deeds were not available to check, so they are not cited for this outline.
- Left out: the other new states and territories of the 1857 Constitution's art. 43 (e.g. Aguascalientes, Colima, Tlaxcala), because the status of each was not confirmed.

### Dates and places

- **`e7-cuernavaca-1855`**: 4 Oct 1855 is confirmed by several biographical sources. It was not checked against the junta's acta.
- **`e7-plan-ayutla`**: Acapulco lies about 85 km west of Ayutla (corrected from 80).
- **`e7-zacapoaxtla-puebla-1856`**: given to the month (Dec 1855 to Mar 1856). The point is at Puebla. Zacapoaxtla is about 110 km northeast (corrected from 90).
- **`e7-constitution-1857`**: "faced excommunication" was softened to the bishops' refusal of absolution to officials who had sworn the oath.
- **Symbolic points.** These features sit at or near the Palacio Nacional, nudged a few hundred metres apart so they do not stack exactly:
  - **`e7-constitution-1857`**, **`e7-reform-laws-1855`**, **`e7-debt-suspension-1861`**, **`e7-black-decree`**, **`e7-juarez-returns-1861`**, **`e7-french-occupy-mexico`** and **`e7-restored-republic`**.

  The same was done at Veracruz (**`e7-veracruz-siege-1859`**, **`e7-reform-laws-1859`**, **`e7-maximilian-lands`**, **`e7-french-evacuation`**) and at Puebla (**`e7-puebla-1867`**). Treat these points as symbolic.
- **`e7-guadalajara-1858`**: 13 March 1858. Some accounts give 14 March.
- **Battles marked at the towns, not on surveyed battlefields:** **`e7-salamanca-1858`**, **`e7-ahualulco-1858`**, **`e7-silao-1860`**, **`e7-miahuatlan-1866`**, **`e7-icamole-1876`** and **`e7-tecoac-1876`**.
- **`e7-veracruz-siege-1859`**: the start is given to the month only (March 1859). The siege was abandoned by 29 March.
- **`e7-anton-lizardo-1860`**: the end of the second siege is given as 20 March (builder) or 21 March (Wikipedia). The feature is now dated "1860-03", and the capture on 6 March is stated in the note.
- **`e7-calpulalpan-1860`**: placed at San Miguel de la Victoria (formerly San Miguel Calpulalpan), Jilotepec, State of México.
  - González Ortega's report (INEHRM PDF; text read) places the fight "en las lomas de S. Miguel de Calpulalpan", from eight to a little after ten in the morning. It confirms the capture of trains, artillery and "millares de prisioneros". English Wikipedia also gives this site.
  - The geocoder hit is a school in the locality. The battlefield on the hills is not surveyed.
- **`e7-tripartite-landing`**: sources give 8, 14 or 17 December 1861, so the date is shown to the month. Its type was changed from battle to political, since there was no fighting.
- **`e7-san-lorenzo-1863`**: marked at San Lorenzo Almecatla (Cuautlancingo). No source found locates the battlefield. A contemporary report puts Comonfort "a league from Puebla" the night before.
- **`e7-acultzingo-1862`**: the fight was on the pass above the town.
- **`e7-black-decree`**: dated 3 October 1865, the date by which it is usually known. Some sources say 2 October.
- **`e7-santa-gertrudis-1866`**: 16 June 1866, near Camargo. The Matamoros garrison capitulated on 23 June, per a Tamaulipas Congress dictamen, and the description now gives that date. The locality of Santa Gertrudis (Camargo) has not been confirmed as the exact battlefield.
- **`e7-san-jacinto-1867`**: there is a source disagreement on the location.
  - Spanish Wikipedia (unsourced) and Wikipedia's "1867 in Mexico" put the battle at the hacienda of San Jacinto, Rincón de Romos, Aguascalientes. Other sources say Zacatecas.
  - Escobedo's report (FRUS 1867, doc. 377) says he overtook Miramón at the hacienda of San Diego and pursued him toward San Francisco de los Adames and El Cuisillo.
  - San Diego geocodes in Luis Moya, Zacatecas, about 14 km north of San Jacinto, so the fighting probably straddled the modern state line.
  - The point stays at San Jacinto.
  - The description was corrected. The builder had Escobedo shooting "the captured French soldiers and Joaquín Miramón" on the field. Estimates of the executed prisoners vary (38 French; 107 in all). Joaquín Miramón was captured wounded and shot on 8 February on Gerónimo Treviño's order (Bancroft Library finding aid).
- **`e7-juarez-return`**: Miramón's raid on Zacatecas in late January 1867 is in the description, shown to the month only.
- **`e7-queretaro-siege`**: the start is given as 6 March; sources say 5 or 6 March. The point is at the Convent of La Cruz, from a known coordinate.
- **`e7-plan-noria`**: the hacienda of La Noria is not located, so the point is at Oaxaca City.
- **`e7-plan-tuxtepec`**: at San Lucas Ojitlán, where the plan was proclaimed on 10 January 1876 (confirmed). It was amended at Palo Blanco, Tamaulipas, on 21 March 1876; that is not mapped.
- **`e7-icamole-1876`**: 20 May 1876, against Lerdist forces under Carlos Fuero (UANL *Humanitas* article; UNAM). Confirmed.

### Routes

- **`e7-juarez-flight-1858`**: schematic straight lines Guanajuato → Guadalajara → Colima → Manzanillo. The Colima and Manzanillo dates are not established, so the route ends in "1858-04".
- **`e7-juarez-voyage-1858`**: a schematic sea route through the documented ports (Manzanillo, Panama, Colón, Havana, New Orleans, Veracruz). The off-shore vertices were chosen only to keep the line at sea.
  - Arrival at Veracruz on 4 May 1858 is confirmed. The departure from Manzanillo (often given as 11 April) is not, so it is given as "1858-04".
  - The voyage reaches far beyond the era's bbox.
- **`e7-french-route`**: straight lines through places on the old Veracruz–Orizaba–Puebla–Mexico road. Lorencez's 1862 advance and Forey's 1863 army are not separated.
- **`e7-juarez-north`**: seats of government, with these dates and sources:
  - INAH: left the capital 31 May 1863; reached Paso del Norte 14 Aug 1865 (both dates confirmed in the text).
  - Nuevo León Congress: Saltillo decree 26 Feb 1864; Monterrey 3 Apr 1864 (confirmed).
  - Left Monterrey around 15 Aug 1864, via Santa Catarina.
  - Chihuahua 12 Oct 1864.

  The Saltillo → Chihuahua leg is schematic. The INAH article is a short popular piece, and its citation was corrected: it is not "no. 10".
- **`e7-juarez-return`**: Paso del Norte was left "definitively" on 10 June 1866 (INAH). The same article wrongly gives 19 June 1867 for the arrival in Mexico City, and also mentions a departure in January 1866. The route uses 15 July 1867.

### Not mapped

- The McLane–Ocampo Treaty: added in the book pass as **`e7-mclane-ocampo`**‡.
- The liberal capture of Guadalajara (Oct–Nov 1860) and the killings of Ocampo, Degollado and Valle (June 1861). Lozada's movement and La Mojonera were added in the book pass (**`e7-lozada`**‡, **`e7-mojonera-1873`**‡).
- The Mexican Railway (completed 1 Jan 1873) is in era 8 (`e8-rail-mexicano`).
- Juárez's death (18 July 1872) is mentioned in **`e7-plan-noria`**.

### Book pass (Gillingham, chs. 11–12) ‡

Features added in the book pass are marked ‡. Gillingham is cited on the existing features he discusses.

- **`e7-mclane-ocampo`**‡: a schematic, non-directional line across the isthmus (Coatzacoalcos – Minatitlán –
  Tehuantepec – Salina Cruz) for the treaty of 14 Dec 1859. The treaty fixed no line; the two northern routes
  (Camargo/Matamoros – Monterrey – Mazatlán; Nogales – Magdalena – Hermosillo – Guaymas) are only in the description.
  Terms from Terrazas Basante (UNAM, 1990), citing the treaty text; Senate rejection 31 May 1860 from Project MUSE's
  abstract of a journal article (not opened). Some sources date the signing 15 Dec.
- **`e7-lozada`**‡: c. 1857 – 19 Jul 1873. The start is approximate (Lira Larios: a movement of "more than fifteen
  years" in 1873). Marked at San Luis de Lozada, his headquarters. Not drawn as a territory: the canton of Tepic is
  roughly modern Nayarit (see `e8-tepic-territory`), but Lozada's control had no fixed edge.
- **`e7-mojonera-1873`**‡: 28 Jan 1873 (FRUS dispatch of 15 Feb 1873). Marked at the geocoded place-name La Mojonera
  in Zapopan; the battlefield (Rancho de la Mojonera) is not located. A Berkeley library note dates Lozada's capture to
  23 Jan, which conflicts with Lira Larios (found 14 Jul 1873 at the Cerro de los Arrayanes); the latter is used.
- **`e7-chalco-1868`**‡: dated 1868. López's manifestos of 23–24 Feb 1868 and the villages' petition of 12 Mar 1868
  (UNAM transcriptions of SEDENA documents) are confirmed; sources disagree on whether he was shot in 1868 or in
  September 1869, and one says the rising lasted into 1869. Gillingham calls the rebels workers who called themselves
  communists; the documents show villagers and tenants.
- **`e7-zacapoaxtla-puebla-1856`**: extended to 3 Dec 1856 and retitled to include the second conservative seizure of
  Puebla (20 Oct – 3 Dec 1856, HNDM description of the rebels' *Boletín oficial*). Gillingham: conservatives "captured
  Puebla twice".

### Differences from Gillingham

- **`e7-juarez-voyage-1858`** / **`e7-veracruz-capital`**: Gillingham gives 5 May 1858 for Juárez's arrival at
  Veracruz; the atlas keeps 4 May (confirmed earlier). Noted on the voyage.
- **`e7-calpulalpan-1860`**: Gillingham has González Ortega capturing Mexico City on Christmas Day 1860; the liberal
  army's formal entry was 1 Jan 1861 (INEHRM efemérides and others). Noted.
- **`e7-puebla-1862`**: Gillingham says Puebla was garrisoned with 12,000 men; the atlas gives no figure, and the usual
  figure for Zaragoza's army is much lower (roughly 4,000–6,000). No note.
- **`e7-mclane-ocampo`**: Gillingham's "two million pesos in immediate cash" is half of the treaty's four million (the
  rest was to settle US claims); consistent.
- Gillingham says President Sebastián Lerdo de Tejada wrote the law that allowed the new land monopolisation; the Ley Lerdo of 1856 (`e7-reform-laws-1855`) was the work of his brother Miguel. No change.
- Gillingham dates Maximilian's own Grito to 1865; he gave it at Dolores in September 1864. Not in the atlas.

### Not mapped (book pass)

- **Tequesquitengo, Morelos** (handoff from agent D; Gillingham ch. 12, undated): the village drowned by the irrigation
  water of the hacienda of San José Vista Hermosa. The available dates range from c. 1840–45 to 1865 (Spanish Wikipedia,
  weakly sourced) and 1885 (a news site), and the cause is also disputed (one geophysicist blames subsoil faults). With
  no reliable date it is left out of both era 7 and era 8.
- **Díaz and the Zapotec National Guard of Ixtlán (1855–)**, which Gillingham stresses in chs. 11–12: no accessible
  scholarly source was checked, so it is not added.
- **Dupin's contre-guérilla** (threats to Ozuluama and Pánuco), **Zitácuaro burned three times** by imperial forces,
  **the Yaqui war against the Sonoran liberals**, **the Plateados of Morelos**, **Crabb's filibusters at Caborca (1857)**
  and the liberal "massacre at Guadalajara in 1858" (not identified): passing mentions.

## Era 8: Porfiriato (1876–1911)

- Fact-checked after the build. Features added in that pass are marked †.

### Territories and boundary lines

- **`e8-tepic-territory`**: the modern state of Nayarit. It is dated to Manuel González's decree of 12 December 1884 (Wikipedia). The decree text was not seen.
- **`e8-quintana-roo-1902`**: the modern state of Quintana Roo. It is dated to the reform of constitutional arts. 43 and 45 of 24 November 1902, as recited in a Quintana Roo Congress document. The 1902 western limit was disputed and has been redrawn since. The territory was abolished in 1931 and restored in 1935 (not mapped).
- **`e8-guatemala-boundary-1882`** and **`e8-belize-boundary-1893`**: lines taken from the Natural Earth 1:10m admin-0 borders. River sections follow modern channels.
  - **Guatemala.** The treaty text was checked (UN Delimitation Treaties Infobase): signed 27 September 1882 by Mariscal and Herrera, in force 1 May 1883.
    - The description now gives the whole course of the line, including the parallel and meridian around the northern Petén to 17°49′.
    - The claim that the treaty "opened the Soconusco to coffee" was softened, because coffee was grown there before 1882.
  - **Belize.** Signed 8 July 1893 by Mariscal and Sir Spenser St John, with an additional convention of 7 April 1897 (Mariscal–Dering) on navigation in Chetumal Bay. The builder's citation had "Spenser–Mariscal" and "supplementary convention"; both were corrected. Ratified in 1897.
    - The line drawn runs from the mouth of the Río Hondo, up the Hondo and Blue Creek, and along the meridian of Garbutt's Falls to the tripoint.
    - The treaty's course through Chetumal Bay to the Boca de Bacalar Chico is not drawn.
- Not mapped:
  - The US–Mexico boundary conventions of 1882, 1884 and 1889. They re-marked the existing line and created no new one.
  - The Chamizal dispute.

### Railways

All railways are `route` lines with `directional: false`, marked approximate; the Interoceanic is schematic. Their alignments come from Natural Earth 1:10m railroads (modern lines), routed by shortest path through geocoded stations and simplified.

A vertex check found every line's stations in the right order, with the nearest vertex within about 5 km of each station. The exception is Saltillo, about 6.5 km from the modern line. This is now stated in **`e8-rail-nacional`**.

Where the modern network has no matching line, the segment is drawn straight from station to station:
- Mexican Railway: Apan–Otumba–Teotihuacán
- Mexican Central: Zacatecas–Fresnillo–Cañitas
- International: Monclova–San Pedro de las Colonias
- Tampico branch: Chicalote–San Luis Potosí
- Interoceanic: Mexico City (San Lázaro)–Ayotla–Río Frío–San Martín Texmelucan–Puebla
- Manzanillo line: Colima–Armería–Manzanillo

Feature by feature:
- **`e8-rail-mexicano`**: dated 1 January 1873, three years before the era begins (a deliberate validator warning). The company is the London-registered Imperial Mexican Railway. The builder's "begun in the 1850s" was corrected: the line was built under concessions from the 1830s on, and its first stretch from Veracruz opened in 1850. Whether the 1873 main line ran through Huamantla, as the modern line does, was not checked.
- **`e8-rail-sonora`**: built by the Santa Fe in 1879–82. Now dated to the last spike at Nogales on 25 October 1882 (Union Pacific; Online Archive of California).
- **`e8-rail-central`**: dated "1884-03", because the first through train from Mexico City passed Paso del Norte on 25 March 1884 (Kuntz Ficker). The "last spike of 8 March 1884" was not confirmed, and one site gives 10 April for a formal inauguration. The builder's "along the old silver road of the Camino Real" was corrected: the line followed the Camino Real only as far as Zacatecas, then crossed the Laguna.
- **`e8-rail-nacional`**: dated "1888-09" (Wikipedia). Kuntz Ficker has the line working from early 1888. The station sequence is the standard description; no source here gives a station list. "Palmer–Sullivan" comes from Pletcher and was not confirmed online; Wikipedia names only Palmer. The Mexico City terminus was the Colonia station.
- **`e8-rail-internacional`**: dated from 1888 (Torreón, March 1888) to October 1892 (Durango). It is not confirmed that the line passed through San Pedro de las Colonias, so that section is called schematic in the note.
- **`e8-rail-tampico`**: dated 1890 (Wikipedia). Kuntz Ficker gives 1889 for the start of service.
- **`e8-rail-interoceanico`**: dated 1891.
  - **Terminus.** The Mexico City terminus was corrected from Buenavista to San Lázaro, and Ayotla and Río Frío were added as waypoints, following a history of the San Martín station (eumed.net).
  - **Puebla.** Whether Puebla was on the main line from the start is disputed. Wikipedia mentions a later cut-off bypassing Puebla, while one source dates the Interoceanic's Puebla station to 1897.
  - **Stations.** The stations between Puebla and Perote are not established.
- **`e8-rail-sur`**: November 1892 (Wikipedia), built by Read & Campbell, reaching Tehuacán in 1891.
- **`e8-rail-guadalajara`**: 1888 (Kuntz Ficker; Wikipedia).
- **`e8-rail-manzanillo`**: dated 1908, the completion of the Guadalajara–Manzanillo line (Wikipedia). The Colima–Manzanillo section via Armería opened on 16 September 1889, according to the Colima Congress history; Armería was added as a waypoint.
- **`e8-rail-tehuantepec`**: dated to the month, January 1907. Sources give 23 or 25 January for the formal reopening. The line was first completed in 1894. The details of the government–Pearson partnership are from Garner and were not checked online.
- **`e8-rail-progreso`**: dated 15 September 1881 (INAH).
- **`e8-ferrocarriles-nacionales`**: dated 1908, from the agreement of February 1908. Sources disagree on whether the company was constituted in March or April. Track: about 600 km in 1876 and about 19,280 km in 1910.

### Routes

- **`e8-yaqui-deportations`**: a schematic route following the stages in Turner (1910), ch. 3:
  1. a government ship from Guaymas to San Blas;
  2. on foot via Tepic to San Marcos;
  3. by the Mexican Central to Mexico City;
  4. by rail to Veracruz;
  5. by steamer to Progreso.

  Notes on the route:
  - **Ixtlán** is an assumed waypoint on the Tepic–San Marcos road and is not in Turner.
  - **Mexico City–Veracruz.** This leg used to follow the Mexican Railway via Orizaba, which nothing supports. Turner calls the line the "International", and which line was meant is not established, so the leg is now drawn straight.
  - **Dates.** 1902–1908 follows Padilla Ramos, who records Yaquis in Yucatán from October 1902 and a peak in 1907–08. Turner says deportation became large about 1905.
  - **Numbers.** Padilla Ramos gives about 8,000; other estimates run to 15,000.
  - **Valle Nacional.** Yaquis being sent there is not confirmed. Turner says the labourers at Valle Nacional were Mexicans, not Indians, so the claim stays out.
  - **Name correction.** The historian is Raquel Padilla **Ramos**, not "Padilla Calderón".

### Points and dates

- **`e8-tres-castillos`**: moved to Wikipedia's coordinate for the hills (29.967, -105.783). That is 16.6 km from the locality geocode, which is why check-places flags it; the note explains the distance. Sources give 14 or 15 October 1880, so it is shown to the month. "Ended the Apache raiding" was softened to "largely ended".
- **`e8-tomochic`**: shown as December 1891 to October 1892. The federal defeats were on 26 December 1891 and 2 September 1892, and the final siege ran 20–29 October 1892.
- **`e8-cananea-1906`**: now 1–3 June 1906.
- **`e8-ebano-1904`**: year only. La Pez No. 1 is usually dated April 1904.
- **`e8-potrero-del-llano`**: 27 December 1910. Some accounts say 26 December. The Golden Lane is not drawn. Dos Bocas (1908) is not mapped.
- **`e8-fundidora`**: founded 5 May 1900, with its first blast furnace lit in 1903. The builder's "first blast furnace in Latin America" was corrected to "Latin America's first integrated iron and steel works", because earlier charcoal furnaces existed.
- **`e8-desague-1900`**: inaugurated 17 March 1900. The canal is 47.5 km. Some sources date the physical completion of the works to 1897.
- **`e8-rio-blanco-1907`**: the burned store was Víctor Garcín's tienda de raya; the builder's "company store" was corrected. The death toll is disputed.
- **`e8-valle-nacional`**: the builder's "political prisoners" was removed, because Turner describes petty offenders consigned by jefes políticos. Turner's visit was in late 1908.
- **`e8-henequen`**: corrected so that Molina's house is International Harvester's buying agent, not a seller to it.
- **`e8-chan-santa-cruz-1901`**: the builder's "advancing ... with a railway" was wrong, because the Vigía Chico line came later. Bravo advanced from Peto, building a road, a telegraph line and forts. Dated 4 May 1901, from Bravo's telegram; some sources give 3 May.
- **Economic regions** shown as single points with approximate spans: **`e8-torreon-laguna`**, **`e8-morelos-sugar`**, **`e8-henequen`** and **`e8-soconusco-coffee`**. In **`e8-morelos-sugar`**, the Womack citation was corrected to Knopf, 1969.
- **`e8-payo-obispo`**: 5 May 1898 (confirmed).
- **`e8-plan-san-luis`**: marked at San Antonio, Texas, where the plan was written. It is dated San Luis Potosí, 5 October 1910.
- **`e8-plm-risings-1906`**†: marked at Acayucan.
  - **Dates.** 30 September to 3 October 1906 (Wikipedia; Cockcroft).
  - **Jiménez.** The Jiménez, Coahuila, raid of 26 September is described but not marked.
  - **Numbers.** Rebel numbers at Acayucan vary widely between sources, so none is given.

### Not mapped

- Left to era 9:
  - the Serdán house in Puebla (18 Nov 1910);
  - the risings of 20 November 1910;
  - Ciudad Juárez (May 1911).
- **The Mazocoba massacre** (18 January 1900): the site in the Sierra del Bacatete has no reliable coordinates.
- Also not mapped:
  - the Creelman interview (1908), since added in the book pass (`e8-creelman-interview`);
  - the Southern Pacific of Mexico's west-coast line;
  - El Boleo (Santa Rosalía).

### Book pass (Gillingham, *Mexico: A 500-Year History*, chs. 12–14, 16)

- ‡ marks a feature added in the book pass. Gillingham is cited on the features he substantively discusses.
- ‡ **`e8-zacapu-cienega`** (start 1899, end 1910): Gillingham tells the Naranja story at length (ch. 12). The
  dates, the 12,000 ha drained and the names Eduardo and Alfredo Noriega come from Guzmán Ávila's UNAM thesis (2009),
  which works from the concession records. Marked at the locality of Cantabria, the hacienda headquarters; the end
  year is "the last years of the Porfiriato" rounded to 1910.
- ‡ **`e8-dos-bocas-1908`**: marked at the Wikipedia coordinate of the craters, 27 km from the town of Ozuluama
  (explained in the note). The amount of oil lost and the well's number vary between sources.
- ‡ **`e8-creelman-interview`**: dated to the March 1908 issue of *Pearson's Magazine*; the exact day of the interview
  at Chapultepec was not established.
- ‡ **`e8-tlahualilo-colony`**: dated to the year only. The point marks the town of Tlahualilo; the estate was large,
  and where the colonists' camps stood was not established.
- ‡ **`e8-san-jose-de-gracia`**: included because Gillingham uses Luis González's microhistory of the town as a
  running example through chs. 12–16.
- Not added from the book:
  - **Tequesquitengo** (ch. 12): Gillingham places the drowning of the village by the Vista Hermosa hacienda among
    Porfirian dispossessions, but the sources checked (Spanish Wikipedia, citing Womack) put the flooding in the
    mid-nineteenth century, with the church tower under water by 1865. It predates the era (handoff to era 7).
  - **Lecumberri penitentiary** (opened 29 September 1900): already marked as the site of Madero's murder (`e9-madero-murder`).
  - Topolobampo (Owen's colony), the Lacandón lumber camps, Batres's excavations at Teotihuacán, the Mazatlán plague
    and the 1903 Monterrey shootings: passing mentions only.

### Differences from Gillingham

- **`e8-cananea-1906`**: Gillingham (ch. 13) dates the Cananea strike to 1907 (twice) and says 23 were shot by
  company men and Arizona Rangers. The strike was on 1–3 June 1906 (Anderson, Knight); the atlas keeps 1906 and adds
  the book's figure and the Rynning detail in the note.
- **`e8-desague-1900`**: Gillingham (ch. 13) has Díaz inaugurating the drainage "when it was finished in 1905" and
  again in 1910. The atlas keeps the formal opening of 17 March 1900 (Perló Cohen) and notes the book's dates.
- **`e8-ebano-1904`**: Gillingham (chs. 12, 16) calls Doheny "the founder of Standard Oil" and his firm Standard Oil.
  Doheny's companies were his own until Standard Oil of Indiana took control of his holding company in 1925; the note
  explains this. (Ch. 12 also says Standard Oil bought Cerro Azul; the buyer was Doheny's Huasteca Petroleum.)
- **`e8-zacapu-cienega`**: Gillingham names the Noriegas as Íñigo and Remigio and dates their land campaign to 1883;
  Guzmán Ávila has the concession obtained by Íñigo for his nephews Eduardo and Alfredo and the works begun in 1899.
  The atlas follows the thesis and notes the book's version. Gillingham's "thirty thousand acres" for the hacienda may
  be the thesis's 30,000 hectares.
- **`e8-tomochic`**: no conflict; the book's figures from the army returns (1,200 troops, 217 killed, 114 survivors)
  are added to the note.
- The book dates Díaz's rule "from 1877 to 1911" (his first election); the atlas era starts with his seizure of power
  in November 1876. No change.

## Era 9: Revolution (1910–1920)

### Territories (all schematic, hand-drawn, dated December 1914)

- **`e9-villista-zone`**: (fact-check: it crossed about 1,300 km² into Texas and New Mexico along the Rio Grande and
  the Chihuahua border; it has been intersected with modern Mexico.) The core Katz describes for late 1914 (Chihuahua, Durango, La Laguna, Zacatecas,
  Aguascalientes, and the Central railway corridor through the Bajío to Mexico City). It is not a front line.
  - Left out on purpose: Maytorena's Conventionist Sonora, the Conventionist hold on San Luis Potosí, and
    Guadalajara (taken by Villa in December 1914 and fought over into 1915).
  - The western edge in the Sierra Madre and the edge in western Coahuila are loose; nobody controlled the
    Sierra effectively.
  - The corridor is drawn about 40–60 km wide around the railway, which is a guess at "control along the line".
- **`e9-zapatista-zone`**: Morelos plus the adjacent districts of Puebla, Guerrero, México and the southern
  Federal District, anchored on named towns after Womack. Zapatista reach into Guerrero (Chilpancingo, taken in
  March 1914) and southern Puebla went well beyond this outline at times.
- **`e9-constitutionalist-zone`**: the least certain of the three.
  - It is the Gulf coast from the lower Rio Grande to Yucatán, the northeast (Monterrey, Saltillo), Chiapas,
    and a small Agua Prieta–Naco enclave on the Sonora border.
  - Fact-check: the hand-drawn ring crossed about 80 km² into Texas, 190 km² into Guatemala and 840 km² into
    Belize. It has been intersected with modern Mexico (Natural Earth), so its northern and southern edges now
    follow the modern borders. `clip: "land"` is kept.
  - Saltillo and Monterrey were Carrancista in December 1914 but fell to Felipe Ángeles in January 1915.
  - Not shown: Oaxaca's "sovereignty" movement (neutral or hostile to both sides); Carrancista forces in Jalisco,
    Michoacán and Sinaloa; the Mapache planters' revolt in Chiapas. Large areas (San Luis Potosí, Guerrero,
    Oaxaca, northern Coahuila, Sinaloa) are left unshaded rather than assigned to a faction.
  - A possible alternative would be `from_states` (Tamaulipas, Nuevo León, Veracruz, Tabasco, Chiapas, Campeche,
    Yucatán, Quintana Roo), but that would overstate control in Nuevo León and Chiapas, so I hand-drew it.
- I did not use `from_states` anywhere in this era, so `npm run derive:states` was not needed.

### Dates and places

- **`e9-plan-de-ayala`**: placed at Ayoxuxtla (Ayoxustla), Huehuetlán el Chico, Puebla, following Womack and
  INEHRM. Spanish Wikipedia simply says "Ayala, Morelos", and the document bears the name of Villa de Ayala.
  There is also an account that it was drafted at Jumiltepec and published at Ayoxuxtla three days later.
- **`e9-serdan`**: the coordinate is my estimate for 6 Oriente 206 (the geocoder only found the street), and the
  check uses Puebla city (0.4 km). This event straddles era 8 (Porfiriato, ends 1911). Era 8 maps the Plan of San
  Luis (`e8-plan-san-luis`) but not the Serdán siege, so there is no duplicate. Accounts differ on whether Aquiles
  Serdán was killed on the night of the 18th or the next morning; the text says "by most accounts the next morning".
- **`e9-treaty-ciudad-juarez`** and **`e9-ciudad-juarez-1911`** also fall inside the overlap with era 8 (1911).
- **`e9-rellano`**: the first battle is given as 23 or 24 March 1912, so only the month is shown for the start.
- **`e9-torreon-1914`**: the federals left Torreón on the afternoon/evening of 2 April 1914 and Villa occupied it on
  the 3rd; 2 April is shown. The start is given only as March 1914: accounts date the opening of the attack (at
  Sacramento and Gómez Palacio) to 21, 22 or 23 March.
- **`e9-trinidad-1915`**: shown as April–June 1915. The usual range is about 29 April to 5 June, and Obregón lost
  his arm on about 3 June, but I could not confirm the exact days, so only months are given. Britannica attaches
  the arm to "Celaya" loosely; most sources put it at Santa Ana del Conde during the Trinidad/León fighting.
- **`e9-el-ebano`**: starts on 21 or 28 March 1915 depending on the source, so only the month is shown; it ended
  31 May.
- **`e9-agua-prieta-1915`**: given to the month (the attack was on the night of 1 November 1915).
- **`e9-aguascalientes-convention`**: the end is given as November 1914. English Wikipedia says the Convention
  sat in Aguascalientes from 10 October to 9 November; other accounts run to mid-November. Gutiérrez's election
  is said to be "early November" (usually 1 November).
- **`e9-carranza-veracruz`**: November 1914 to October 1915, after Berta Ulloa, *Veracruz, capital de la nación
  (1914–1915)*, which treats Veracruz as the capital for about eleven months. The exact day Carranza left was not
  confirmed.
- **`e9-plan-guadalupe`**: placed at the geocoded "Ex-Hacienda de Guadalupe" in Ramos Arizpe municipality,
  about 75 km north-northwest of Ramos Arizpe town. Fact-check: local and tourism sources put the historic
  ex-hacienda on the Saltillo–Monclova highway, 95–101 km by road from Ramos Arizpe/Saltillo, which fits this point;
  it has not been checked against INEGI.
- **`e9-decena-tragica`**: marked at the Ciudadela; the fighting covered the city centre.
- **`e9-madero-murder`**: marked at Lecumberri (now the AGN). The killing was outside its walls; the exact spot
  is not marked.
- **`e9-columbus`**: deaths given as "about eighteen" Americans (usually 10 civilians and 8 soldiers; some counts
  differ by one or two). Villista losses are not given a number.
- **`e9-carrizal`**: US losses vary between sources (12 or 14 killed, 23–25 captured), so the description uses
  rounded figures.
- **`e9-veracruz-1914`**: Mexican casualties vary widely (about 126 to over 200), so the description gives no number.
- **`e9-sabinas-1920`**: 28 July 1920 is the most cited date. Some sources give other dates (one popular source
  says 26 June; a UNAM teaching text says August), and the `note` says so.
- **`e9-tlaxcalantongo`**: the 7 May 1920 departure is from a US diplomatic telegram (FRUS, URL checked). The trains
  were stopped at Aljibes, Puebla. The geocoder's "Aljibes" is a different place (Huejotzingo), so I did not draw
  the flight as a route.
- **`e9-queretaro-constitution`**: the geocoder's "Teatro de la República" result was 1.5 km off, in a
  housing estate. The point uses the theatre's known position in the historic centre and is checked against the
  city (0.2 km).

- **`e9-cuautla-1911`**†: siege of Cuautla, 13–19 May 1911, after Womack. Marked at the main square (the Casa de
  Morelos), 2.3 km from the geocoder's point for the town. Like the Ciudad Juárez features it falls in the 1911
  overlap with era 8, which does not map it.

### Routes

- **`e9-division-del-norte`**: main stations on the Mexican Central only. Torreón–Fresnillo is straightened (the
  line ran via Pedriceña and Camacho). The Ojinaga campaign (January 1914) and the Paredón–Saltillo detour
  (May 1914) are not drawn.
- **`e9-obregon-west`**: starts at Nogales and omits the Cananea–Naco moves. The Tepic–Guadalajara leg (via
  Orendáin, which I could not geocode reliably: the geocoder returned street names in Tequila) and the
  Guadalajara–Irapuato–Celaya–Querétaro stages are straight lines between documented stops.
- **`e9-punitive-expedition`**: the Satevó vertex was the municipality centroid (about 22 km south of the town); it
  now uses San Francisco Javier de Satevó. "Some 500 miles" is the distance by the expedition's route (Parral is
  usually given as 513 miles into Mexico); in a straight line it is about 350 miles from Columbus. Schematic, one representative line through documented places. The expedition
  moved in several columns, including one from Culberson's Ranch and the fight at Guerrero, which are not drawn.

### Not mapped

- The Plan of San Luis Potosí (written in San Antonio, dated San Luis Potosí, 5 October 1910): probably era 8.
- Huerta's exile and the Ypiranga affair are covered in descriptions, not as features.
- Santa Isabel (January 1916), Glenn Springs (May 1916), the Battle of Aguascalientes (July 1915) and the
  Morelos campaigns of Juvencio Robles and Pablo González are mentioned in descriptions or left out.
- The 1918 influenza epidemic, emigration to the US, and the overall death toll of the decade are not mapped.

### Fact-check notes

- † marks a feature added in the fact-check.
- **`e9-veracruz-1914`**: "nineteen Americans" is the number killed in the fighting of 21–22 April as usually given;
  totals for the whole occupation run to 21–22.
- **`e9-trinidad-1915`**: 29 April to 5 June 1915 (38 days) fits the "38 days" in the sources, but I could not confirm
  either day in a scholarly source, so months are still shown.


### Book pass (Gillingham, *Mexico: A 500-Year History*, chs. 14–16)

- ‡ marks a feature added in the book pass. Gillingham is cited on the features he substantively discusses.
- ‡ **`e9-cuchillo-parado`**: Ortega's own account gives sixty men (Gillingham also says sixty), Spanish Wikipedia
  seventy. Whether it was the first rising is disputed with Orozco's at San Isidro.
- ‡ **`e9-magonistas-baja-1911`**: one point at Mexicali for the whole rising; the date of the capture of Tijuana (9 May)
  rests on contemporary press reports and is not given in the feature.
- ‡ **`e9-felix-diaz-1912`**: Veracruz point shared with the other Veracruz features.
- ‡ **`e9-pelaez-huasteca`**: schematic. The point at Temapache stands for a territory of several thousand km²; the
  start (November 1914, when he began levying the companies) comes from US consular reports as summarised in search
  results, and the monthly payment figures vary.
- ‡ **`e9-feminist-congress-1916`**: attendance 600–700 depending on the source.
- Not added from the book: Che Gómez's revolt at Juchitán (Dec 1911), the Puebla killings of July 1911, Zapatista
  Milpa Alta (1911), San Pedro de las Colonias (1914, mentioned in `e9-torreon-1914`), Villa's Ciudad Juárez attack of
  June 1919, the Morelos reconcentration of 1916 and the Camargo massacre of women (1916): brief mentions.

### Differences from Gillingham

- **`e9-columbus`**: Gillingham (ch. 15) gives 8 March 1916, puts Columbus on "the Arizona border" and says 17
  Americans were killed. The atlas keeps 9 March (the attack came before dawn on the 9th after a night crossing),
  Columbus is in New Mexico, and it keeps "about eighteen"; all noted.
- **`e9-punitive-expedition`**: Gillingham gives 11,000 men at the peak; the atlas's "about 10,000" is kept and the
  book's figure noted.
- **`e9-trinidad-1915`**: Gillingham calls the battle "León" and dates it to 3 June 1915; noted.
- **`e9-felix-diaz-1912`**: Gillingham has Félix Díaz imprisoned in Santiago Tlatelolco after the Veracruz revolt;
  standard accounts put him in the Penitentiary and Reyes in Tlatelolco. Noted.
- Book slip, no atlas change: ch. 14 says Huerta arrested Madero "on December 18"; it was 18 February 1913, as in
  `e9-decena-tragica`.
- ‡ **`e9-cantu-mexicali`** (from agent E's handoff, Gillingham ch. 21): the opium taxes are from Gillingham and a Mexican
  study seen only in search results; the checked source (Spanish Wikipedia) speaks of gambling and vice revenue. The
  point shares Mexicali's coordinates with `e9-magonistas-baja-1911`.
- Not mapped (from agent E's handoff): Gillingham's figures for the revolution's demographic cost (ch. 20: about 1.4
  million dead, mostly from disease and famine; typhus in Guanajuato in 1916; the 1917 famine in Tlaxcala; the 1918
  influenza). They are not point events. McCaa's estimate of about 1.4 million excess deaths for 1910–21 agrees with the
  total, but the local figures were not checked.

## Era 10: Consolidation (1920–1940)

### Territories (all schematic, hand-drawn)

- **`e10-cristero-region`**: drawn after Meyer's account of the zones of rebellion: Los Altos and southern
  Jalisco, Colima, western Michoacán, western Guanajuato, southern Zacatecas, Aguascalientes and Nayarit (with
  the Mezquital of Durango).
  - The polygon includes cities that the government held throughout (Guadalajara, Colima, Morelia, León).
  - The eastern edge in Guanajuato and Michoacán is the least certain part.
  - Smaller risings elsewhere (Durango, Querétaro, Guerrero, Oaxaca, Puebla, Mexico State) are not drawn.
  - The Segunda (c. 1934–1938) is described but not mapped; its geography was more scattered.
  - I chose a hand-drawn shape over `from_states` because whole states would overstate it badly (all of
    Michoacán, Zacatecas, Guanajuato).
  - The figures (about 50,000 Cristeros at the peak, about 90,000 combatants killed) are Meyer's estimates and
    are attributed to him in the text.
- **`e10-laguna-ejidos`**: anchored on the Laguna towns. The decree as announced (El Colegio de México account)
  covered 447,516 ha for 34,743 ejidatarios in 296 ejidos; other accounts round to about 500,000 ha and
  35,000–38,000. The description uses rounded figures.
- **`e10-henequen-zone`**: the henequen belt around Mérida. Fact-check: the decree of 8 August 1937 (272 ejidos,
  about 178,000 ha, of which some 117,000 ha were henequen fields) is given in two legal-history articles, so the
  feature is now dated to the day and the description gives those figures. Another account gives about 360,000 ha
  distributed in 1937–38. How and when the ejidos were merged into the "Gran Ejido" (1938) is stated loosely.
- **`e10-golden-lane`**: a narrow outline through the field towns (Juan Casiano, Chinampa, Naranjos, Cerro Azul,
  Potrero del Llano, Álamo). The real fields were separate pools along a buried reef, and the northern end
  (toward Dos Bocas) is uncertain. It is dated 1938 to tie it to the expropriation, though its boom was
  1910–1921 (eras 8–9).

### Dates and places

- **`e10-esperanza-1924`**: fact-check: 27–28 January 1924, after Plasencia de la Parra, *Personajes y escenarios
  de la rebelión delahuertista* (UNAM, 1998), who also names Maycotte's forces alongside Sánchez's.
- **`e10-ocotlan-1924`**: given to the month (February 1924). Plasencia de la Parra has the order to cross the river
  issued on 8 February for the following daybreak; Wikipedia's 1924 timeline gives 10 February. The description now
  says that Obregón directed the campaign, Amaro's troops made the crossing, and Salvador Alvarado held the rebel
  line (Estrada was away with his column toward Michoacán); the builder's text had Obregón defeating Estrada there.
- **`e10-delahuerta-veracruz`**: the end is given only as 1924. Spanish Wikipedia gives 17 June 1924. De la Huerta
  left Veracruz for Frontera, Tabasco, in early February 1924 (Plasencia de la Parra); the builder's "left from
  Frontera on 11 March" for his departure from Mexico was not confirmed, so the text no longer gives a month.
- **`e10-gorostieta`**: placed at the modern locality "El Valle" in Atotonilco el Alto, about 7 km southwest of
  the town. A Jalisco government publication confirms that the Hacienda del Valle (now a museum) is in Atotonilco
  el Alto municipality, but the geocoder did not find the building, so the exact match of the point to the hacienda
  is still an inference from the name.
- **`e10-arreglos`**: fact-check: moved to the National Palace and marked approximate. Portes Gil's declaration
  of 21 June 1929 is dated "Palacio Nacional" (text checked on Memoria Política de México). The sources checked
  do not say where the talks themselves took place (one says the bishops stayed at a house in Tacuba and met Portes
  Gil on 12–13 and 21 June), so the note says so.
- **`e10-ctm-1936`**: still schematic at the city centre. The congress dates (21–24 February 1936) are confirmed
  (Memoria Política de México, Centro Lombardo, UNAM history of the CTM), and the feature now uses them; English
  Wikipedia gives 21 February as the founding date, while the CTM marks 24 February. No source I could reach names
  the hall or theatre where the congress met.
- **`e10-railways-1937`**: marked at Buenavista station as a symbol; the decree covered the whole network.
- **`e10-yaqui-1937`**: fact-check: dated 27 October 1937, the presidential *acuerdo* on the Yaqui agrarian
  question (cited in US diplomatic correspondence and Mexican sources). The territory is given as 417,000 ha in one
  source and 485,235 ha in another, so the text says "more than 400,000 hectares". The claim that the titles were
  handed over at Cajeme on 31 October, and that Cárdenas was there in person, could not be confirmed and is no
  longer in the text; Ciudad Obregón is now described only as the valley's main town.
- **`e10-mexicali-1937`**: the occupation date (27 January 1937) is well attested. The expropriation decree date
  (9 or 14 March 1937) differs between sources, so the description says "that spring".
- **`e10-nueva-italia`**: only the year (1938) is given. I could not confirm the month of the expropriation of
  Lombardía and Nueva Italia (often said to be November 1938); work on the Cusi family to 1938 supports the year.
- **`e10-cedillo`**: the rebellion began in May 1938 (often given as 15 May). Cedillo's death is officially
  11 January 1939; another version has him killed in his sleep on 9 January.
- **`e10-poza-rica`**: the first big well (Poza Rica No. 2) came in in 1930; English Wikipedia dates the field's
  discovery to 1932, so "around 1930" stays. A Poza Rica–Azcapotzalco pipeline is documented (a UNAM thesis on it),
  but not its year, and the text gives none.
- **`e10-minatitlan`**: Pemex and other sources say the refinery was set up in 1906; others give 1908 for its
  opening. The text now says "about 1906–08". The builder's claim that it processed crude "from the Isthmus fields"
  was not confirmed and was removed.
- **`e10-oil-expropriation`**: "seventeen companies" is the usual figure. I wrote that compensation was agreed
  with El Águila "later in the decade" (1946–47) rather than give a year.
- **`e10-garrido-tabasco`**: 1919 (first interim governorship) to August 1935 (when he lost control of the state).
  Sources disagree on the years of his first governorship (1920–24, 1922–26, 1923–26), so the text says "the early
  1920s". The month he left for Costa Rica was not found.
- **`e10-vasconcelos-sep`**: the SEP building coordinate is my estimate (República de Argentina 28). It is checked
  against the adjacent Colegio de San Ildefonso (0.2 km), because the geocoder sends "SEP" to the modern
  headquarters in Benito Juárez.

- **`e10-tepatitlan-1929`**: Meyer gives 19 April 1929; González Navarro puts Reyes Vega's death on 20 April. The
  builder's "took Tepatitlán" was softened to a Cristero victory in the fighting there.
- **`e10-jimenez-1929`**: the battle began on 30 March 1929 and lasted about five days (ending near La Reforma),
  so the end is given to the month.

### Not mapped

- The Calles–Cárdenas break and Calles's expulsion (April 1936), and the 1940 election (Almazán): political
  events with no clear place.
- Socialist education (1934) and the killing of rural teachers in the Segunda are mentioned in descriptions only.
- The PRM (1938) is folded into **`e10-pnr-1929`**.
- The Yaqui Valley's later Green Revolution role belongs to era 11 (`e11-yaqui-valley`); the 1937 feature only
  mentions it.
- Possible overlap with era 9: the Plan of Agua Prieta, Carranza's death and Villa's surrender (all 1920) are in
  era 9. Era 10 starts with the Obregón presidency.
- Overlap with era 8: `e8-potrero-del-llano` covers the Golden Lane's discovery (1910) and `e8-henequen`,
  `e8-torreon-laguna` and `e8-ferrocarriles-nacionales` the Porfirian background of the henequen, La Laguna and
  railway features here. These are different events, not duplicates.


### Book pass (Gillingham, *Mexico: A 500-Year History*, chs. 15–16)

- ‡ marks a feature added in the book pass. Gillingham is cited on the features he substantively discusses.
- ‡ **`e10-escudero-acapulco`**: marked at central Acapulco; the killing site (El Aguacatillo) was not geocoded.
- ‡ **`e10-icam-1925`**: dated to February 1925 (the day of the takeover of La Soledad is often given as 21 February,
  not confirmed). The geocoder returns the parish of Santa Cruz y Soledad; that it is the church the schismatics took
  is my reading of "La Soledad".
- ‡ **`e10-ayotzinapa-1926`**: founded 1926 in Tixtla, moved to the Ayotzinapa site in the early 1930s; the point marks
  the present school. Only one independent source (Wikipedia) was checked.
- ‡ **`e10-primo-tapia-naranja`**: start is the November 1921 union of Naranja, Tiríndaro and Tarejero; the day of
  Tapia's death in 1926 (often given as April) was not confirmed.
- ‡ **`e10-huitzilac-1927`**: thirteen or fourteen companions killed with Serrano depending on the source.
- ‡ **`e10-monterrey-1936`**: dated to February 1936; the usual date of the fourteen points (11 February) was not
  confirmed.
- ‡ **`e10-calles-exiled-1936`**: marked at the Mexico City airport (the Puerto Central Aéreo at Balbuena is the
  site of the present airport); Calles's hacienda of Santa Bárbara was not located. The Excélsior article was found
  by search, not opened.
- ‡ **`e10-zacatepec-1938`**: dated to the year only; the inauguration day was not confirmed.
- Not added from the book: the 1929 Vasconcelos campaign, the Hueyapan and Tetipac teachers, Pisaflores and Manuel
  Parra's Black Hand, the Guelaguetza, the Torreón executions of 1927 and the Escobaristas' stolen silver.

### Differences from Gillingham

- **`e10-laguna-ejidos`**: the book puts the Laguna expropriation "in the last weeks of 1936" with 38,000 ejidatarios
  on more than a million acres; the atlas keeps the decree of 6 October 1936 and notes the book's figures.
- **`e10-henequen-zone`**: the book gives 1.2 million acres (about 490,000 ha) in late 1937, against the 178,000 ha of
  the August 1937 decree (other accounts up to 360,000 ha). Noted.
- **`e10-nueva-italia`**: the book dates the seizure to November 1938 (the atlas gives only the year; not confirmed).
  Ch. 12 also says three thousand Italian colonists founded Nueva Italia; this was not checked and is not used.
- **`e10-sinaia`**: the book gives thirty thousand Spanish refugees; the atlas keeps "some 20,000 or more" and notes
  the book's figure.
- **`e10-cristero-region`**: the book gives "as many as one hundred thousand" dead against Meyer's 90,000; noted.
- **`e10-delahuerta-veracruz`**: not a conflict. The book dates the rising to 30 November 1923 in Guerrero; Plasencia
  de la Parra confirms that Rómulo Figueroa moved at Iguala that day. Added to the note.
- Book slip, no atlas change: the book's own timeline (file 072) gives 28 March for the oil expropriation; ch. 16 and
  the atlas have 18 March.
- ‡ **`e10-juarez-drug-trade`** (from agent E's handoff, Gillingham ch. 21): dated 1928–1936 after Mottier's article,
  whose content I saw only through a Wilson Quarterly summary and Wikipedia. The 1926 poppy ban and Rodrigo Quevedo's
  role are attributed to Gillingham.
- From agent E's handoff, also: a second Gillingham date for the Laguna (1937, ch. 20) is added to the note on
  `e10-laguna-ejidos`; the 1940s decline of Nueva Italia (ch. 17) is added to its note; ch. 17 is now cited on
  `e10-pnr-1929`.
- Not mapped from that handoff:
  - **Depression repatriation**: estimates run from about 355,000 to over 400,000 (Hoffman, Gratton) and higher;
    Gillingham gives 423,000. No crossing point or repatriate colony was confirmed, so there is no feature.
  - The 1923 border dry zone (not a point).
  - The Poza Rica army deployments of 1946 and 1949 (era 11).
  - The Veracruz yellow-fever campaign, the Acapulco road, the Monterrey breweries and the Tamaulipas bachelor tax.

## Era 11: PRI era (1940–2000)

- Fact-checked after the build; no features were added or removed in that pass. Many violence features now cite the
  CNDH's dated efemérides (hist.cndh.org.mx / cndh.org.mx), which are short official summaries, not investigations.

### Territories

- **`e11-baja-california-state-1952`** and **`e11-new-states-1974`** are drawn from the modern Natural Earth state outlines
  (via the same union method as `npm run derive:states`). The 1952 and 1974 limits along the 28th parallel are unchanged, but
  Quintana Roo's limits with Campeche and Yucatán were later disputed in the courts, so the modern lines may not match 1974
  exactly. Dates are the Diario Oficial publication dates of the art. 43 reforms (16 Jan 1952, 8 Oct 1974).
- No polygon is drawn for the 1985 lake-bed damage zone, the Chamizal tract, the Zapatista zone or the Guerrero
  counterinsurgency zone. Each would have been guesswork. The Chamizal (**`e11-chamizal`**) is a point at the federal park on
  the returned land. The treaty text (366 + 193.16 + 264.34 acres moved south of the new channel; 193.16 acres of northern
  Córdova Island to the US) and NPS summaries ("366 acres and 71 acres east of Córdova Island") give different figures. The
  description follows the treaty text (net gain of about 437 acres).

### Bracero Program

- Sources: the 2021 National Historic Landmark nomination for Rio Vista (Simmons & Simmons) and the HABS report (2023).
  - The **five reception centres** of 1951 were El Centro, Nogales, Rio Vista (El Paso), Eagle Pass and Harlingen.
  - Harlingen (1951–53) was replaced by **Hidalgo** (1954–63). Harlingen is not mapped. The El Paso Coliseum served
    briefly in 1951 and is not mapped either.
  - Hidalgo's closure is given as 1962 in one passage of the nomination and 1963 in another. **`e11-bracero-hidalgo`** uses 1963.
- The **five migratory stations** of 1951 were Monterrey, Chihuahua, Irapuato, Guadalajara and Aguascalientes.
  - Durango replaced Aguascalientes by 1953.
  - By 1955 Hermosillo and Guaymas/Empalme replaced Guadalajara and Durango.
  - From 1959 only Monterrey, Chihuahua and Guaymas/Empalme remained.
  - Aguascalientes, Durango, Hermosillo, Mexicali, Zacatecas and San Luis Potosí also operated at times and are not mapped.
- **`e11-bracero-irapuato`**: the start is now 1951, the first year the sources used document the station. Screening from
  1944 and contracting from 1945 (Maldonado García) could not be confirmed and is only mentioned in the note. The end date
  of 1955 is an inference from the NHL nomination's list, which does not name Irapuato after 1953.
- **`e11-bracero-guadalajara`** end date 1955 (replaced "by 1955").
- **`e11-bracero-empalme`**: 1955–1964 follows Córdoba Ramírez (BiCentenario no. 49, 2025); one press account gives 1954. US
  sources call it "Guaymas".
- **`e11-bracero-agreement`** is marked at the site of the Estadio Nacional (now the Jardín Ramón López Velarde / former
  Multifamiliar Juárez), where 1942 recruiting took place. The 4.6 million contracts figure (1942–64) is from the Bracero
  History Archive; the NHL nomination gives "over 4.2 million" for 1951–64 alone.
- No resolving URL was found for the NHL nomination (the NPS summary PDF returns 404), so it is cited without one.
- The exact sites of the Mexican stations are not documented in the sources used. All of them are marked approximate at
  the city centres.

### Caciques and political violence

- **`e11-leon-1946`**: the death toll ranges from 8 (the army's figure) to more than 100; the CNDH gives an official 36
  dead and 400 injured. Excélsior's first count was about 40 dead and 300 injured, and León's doctors reported 25. The "two weeks later the PRI was founded" sentence is
  chronology (18 Jan 1946), not a causal claim.
- **`e11-santos-slp`**: the end date of 1959 (the fall of Santos's governor after Nava's 1958 victory) is approximate.
  Santos's Huasteca base is mentioned but not mapped. An earlier draft named his hacienda El Gargaleote; I removed it
  because I could not confirm it.
- **`e11-chilpancingo-1960`**: the CNDH says the troops collected 18 bodies; Milenio gives an official 19; some accounts
  say at least 15. Sources differ on the day in January 1961 when the Senate removed the governor (5 January per the
  CNDH, 30 January in Milenio), so the description says only "January 1961".
- **`e11-acapulco-1967`**: officially 35 dead and 150 wounded (CNDH, which adds "more than 80" killed); Ávila Coronel
  (Historia Mexicana, 2024) gives about 25 dead from police records, and the union dissidents listed more than 100.
- **`e11-jaramillo-1962`**: the bodies were found near Xochicalco, but the exact spot is not documented. The three
  young men killed were Epifania Zúñiga's sons (adopted by Jaramillo, per La Jornada and Crónica), so the description
  now says "her three sons".

### Guerrero's dirty war

- **`e11-atoyac-1967`** and **`e11-dirty-war-atoyac`** share the Atoyac point.
  - El Otatal, where Lucio Cabañas was killed (2 Dec 1974, in Técpan de Galeana municipality per the CNDH), could not be
    geocoded and is not mapped separately. The earlier "about 20 km inland" was not confirmed and has been dropped.
  - The dead of 18 May 1967 are given as five to eleven (the CNDH says at least 11), so the description says "several".
  - **`e11-madera-1965`**: eight guerrillas died; most accounts give five soldiers killed, but the CNDH speaks of six
    soldiers wounded, so the description says "several soldiers (usually given as five)".
  - Counts of the disappeared vary (several hundred for Atoyac in the FEMOSPP draft and in local organisations' counts).
- **`e11-genaro-vazquez`**: he died in the Hospital Civil de Morelia on 2 Feb 1972 after a road accident (CNDH); his
  family alleges he was killed. No point is mapped for his death.
- **`e11-dirty-war-atoyac`**: the note now places Radilla's detention at the checkpoint at Colonia Cuauhtémoc, between
  Cacalutla and Alcholoa (Inter-American Court judgment), rather than "on the road toward Chilpancingo".
- **`e11-aguas-blancas`**: 17 dead is the CNDH (Recomendación 104/1995, now linked) and Amnesty figure; one UAM study gives
  27. The EPR's appearance there on 28 Jun 1996 is confirmed by La Jornada (29 Jun 1996) via search summaries only.
- **`e11-acteal`**: the 2020 acknowledgement was a friendly settlement before the Inter-American Commission (3 Sep 2020)
  covering only some of the victims, and part of Las Abejas rejected it; the description now says so. The point is the locality of
  Aguas Blancas; the ford (vado) where the ambush took place is on the road nearby.
- The **FEMOSPP report** is cited as the 2006 report, with the National Security Archive's posting of the February 2006
  draft. The official final version was never widely published, and some commentators say only drafts are known.

### Other dates and places

- **`e11-tlatelolco-1968`**: the death toll is unknown; estimates run from a few dozen to more than 300.
- **`e11-halconazo`**: the CNDH gives 40 dead; the commonly cited official figure is about 22, NGOs say about 60 and some
  accounts 120. The description gives 40 (CNDH) and the upper estimate.
- **`e11-quake-1985-mexico-city`**: death tolls range from about 4,000–6,000 (official) to more than 10,000. Local time is
  7:17 (USGS), often given as 7:19.
- **`e11-nuevo-leon-building`**: placed approximately on Paseo de la Reforma, within the Tlatelolco estate. The building
  had 13 or 15 storeys according to different sources, and the toll was 200–300.
- **`e11-costureras-1985`**: given to the month only, because I could not confirm the day of the union's registration.
- **`e11-railway-strike`** is schematic, marked at Buenavista for a nationwide movement. Sources give 25 or 28 Feb 1959
  for the start of the strike.
- **`e11-nafta`** is a schematic point at Nuevo Laredo, as a symbol of the trade corridor. The claim that it is the
  busiest land crossing for US–Mexico trade is general knowledge and is not tied to a specific citation.
- **`e11-cantarell`**: the coordinates and production figures come from Wikipedia, alongside Grayson (1980). A better
  PEMEX source would be preferable. "80 km" is the distance offshore, not from Ciudad del Carmen (about 140 km away);
  the Chac-1 well name was dropped because it is not in the sources cited.
- **`e11-ixtoc`**: the volume spilled is given as 3 to 3.5 million barrels (3.3 million is common; PEMEX gave about 3.5
  million). NOAA's incident record gives the daily rate but no total.
- **`e11-quake-1985-epicentre`**: the USGS epicentre is about 380 km from central Mexico City, so the description now says
  "nearly 400 km" (it said 350).
- **`e11-railway-strike`**: "more than 9,000 dismissed" and "more than 800 jailed" are the CNDH figures.
- **`e11-la-realidad`**: the 1996 Intercontinental Encounter (27 Jul–3 Aug) opened at Oventik and closed at La Realidad;
  it was not held only at La Realidad, as the earlier text implied.
- **`e11-chamizal`**: the formal transfer date of 28 Oct 1967 is not in the IBWC or NPS pages cited; it rests on standard
  accounts.
- **`e11-guadalajara-1992`**: the official toll is about 210; other estimates are higher.
- **`e11-san-juanico`**: the toll is about 500 to 600.
- **`e11-papaloapan`**: estimates of the Mazatecs displaced are 20,000–22,000. The dam's completion is given variously
  as 1954, 1955 or 1959 (start of operation), so the end date of 1955 is approximate.
- **`e11-tepalcatepec`**: El Infiernillo was built by the federal electricity commission within the Balsas Commission's
  programme, so the description no longer says the commission itself built it.
- **`e11-border-industrialization`**: Antonio J. Bermúdez's documented role is as head of PRONAF (from 1961); the claim
  that he promoted the 1965 programme itself was dropped.
- **`e11-cancun`**: 20 April 1970 is the date the city celebrates as its founding; the federal decree is of 1971.

### Not mapped

- **1982 debt crisis** and the bank nationalisation (1 Sep 1982), and the **December 1994 peso crisis**: no meaningful
  location, so they belong in the summary.
- **Women's suffrage (1953)**, **1968 Olympic and 1970/1986 World Cup venues** (CU's stadium is mentioned in
  **`e11-ciudad-universitaria`**), the 1940 Almazán election, the assassination of Ruiz Massieu (Sep 1994, mentioned in
  **`e11-colosio`**), the 1999–2000 UNAM strike and the El Charco massacre (1998): left out to keep the era readable.
- The Reforma onshore oil fields (1972) are mentioned in **`e11-cantarell`** but not mapped.

### Book pass (Gillingham, *Mexico: A 500-Year History*, Part Five) ‡

Eleven features were added from chs. 17–21. Each cites the book plus at least one independent source. Every point is
within 5 km of its geocode.

- ‡ **`e11-election-1940`**: schematic, at the Zócalo, where the CNDH efeméride places the main repression. The fighting was
  at polling stations all over the capital. The toll is "decenas" (CNDH), or at least 47 nationally (Wikipedia). The claim
  that government informants thought Almazán had won the cities rests on Gillingham alone.
- ‡ **`e11-henriquistas-1952`**: the toll is unknown. The CNDH cites estimates from a few dozen up to 500, and the FPPM's list
  of 524 detained and 77–100 wounded; Gillingham gives about 500 arrests and 130 wounded. The 1954 dissolution of the
  party is from Gillingham.
- ‡ **`e11-acapulco-resort`**: 1946–1970 is a judgment (Alemán's presidency to the start of Cancún). The only independent
  source is a BBC Mundo overview. A scholarly history of Acapulco would be better.
- ‡ **`e11-san-ildefonso-1968`**: Gillingham calls the building "the Poli boarding school". It was the UNAM's Preparatoria
  no. 1, and the description follows Gaceta UNAM. The rector's march of 1 August is from standard accounts, not from the
  fetched sources.
- ‡ **`e11-pie-de-la-cuesta`**: the two counts do not overlap. A list published in 2024 names 183 victims of 25 flights in
  1972–74; Gillingham's count, from the flight logs, is 54 flights and about 350 bodies in 1974–80. The feature runs
  1972–1980. The point is at the beach settlement; the base was not geocoded. Only Acosta Chaparro's 2002 charge
  (dropped in 2006) is confirmed (Wikipedia); Quirós Hermosillo is not named in the description.
- ‡ **`e11-garza-sada-1973`**: marked on Calle Villagrán; the corner with Luis Quintanar was not geocoded. The end of the Liga
  "by about 1981" follows Gillingham, who says the fighting was over by then.
- ‡ **`e11-operacion-condor`**: schematic point at Badiraguato. The dates are disputed: Cedillo gives Jan 1977–1988, and
  Gillingham 1975–1979, counting the earlier eradication drive. Cedillo is cited from a lecture summary (LACIS), because
  her chapter in Pansters and Smith (2022) was not consulted directly.
- ‡ **`e11-camarena-1985`**: marked at the city of Guadalajara. The US consulate's 1985 address could not be confirmed, and
  El Búfalo (near Jiménez, Chihuahua, per Zeta; one source says Zacatecas) is not mapped. The DEA Museum page returned 403,
  so it is cited without a URL. The dissolution of the DFS is from Gillingham.
- ‡ **`e11-chihuahua-1986`**: marked at the government palace in Chihuahua. The bridge blockades at Juárez are from press
  summaries (Christian Science Monitor and Milenio, via search) and from Preston & Dillon. The fetched Excélsior article
  does not mention them.
- ‡ **`e11-posadas-1993`**, ‡ **`e11-ruiz-massieu-1994`**: precise. Raúl Salinas's sentence is 50 years in Gillingham, and
  27½ years after appeal in Wikipedia; the conviction was overturned in 2005.
- Considered but not added, to keep the era readable: the Quinazo (arrest of La Quina, Ciudad Madero, 10 Jan 1989; in
  Gillingham ch. 19); the Granma's departure from Tuxpan (1956); Campo Militar No. 1 as a separate point (it is already in
  **`e11-dirty-war-atoyac`**); the army's occupation of the Poza Rica and Minatitlán oil fields (Dec 1946 and 1949; ch.
  17); the Politécnico occupation (1956); the Caravan of Hunger of the Nueva Rosita miners (1950–51); the Sinarquista colony
  in Baja California; Volkswagen's Puebla plant; and Rancho El Búfalo, which is mentioned in **`e11-camarena-1985`**.

### Differences from Gillingham

- **`e11-leon-1946`**: 27 killed (Gillingham ch. 17) vs. the official 36 (CNDH).
- **`e11-chilpancingo-1960`**: 21 killed (ch. 18) vs. 18–19.
- **`e11-atoyac-1967`**: seven killed (ch. 18) vs. five to eleven.
- **`e11-genaro-vazquez`**: freed from "Guerrero's state penitentiary" (ch. 18) vs. the prison at Iguala (CNDH and others).
- **`e11-tlatelolco-1968`**: no conflict, but the book's figures are added to the note: 26 (press), 44 (archives), 325 (Guardian)
  and about 150 (popular memory). The book spells the unit "Batallón Olímpica".
- **`e11-halconazo`**: 50 killed (Gobernación, cited in ch. 18) vs. the CNDH's 40.
- **`e11-quake-1985-epicentre`** / **`-mexico-city`**: 7:18 and Richter 8.1 (ch. 19) vs. 7:17 and Mw 8.0 (USGS); Gillingham's
  10,000–40,000 dead is well above the official count.
- **`e11-costureras-1985`**: 1,600 garment workers killed (ch. 19) vs. "several hundred" in other accounts.
- **`e11-election-1988`**: Gillingham gives 50.5/33 per cent and says Cárdenas was awarded three states and Mexico City. The
  official count was about 50.4/31 per cent and gave him four states and the DF.
- **`e11-ezln-ocosingo`**: about 200 Zapatista dead (ch. 19) vs. about 145 deaths in all, officially, for the twelve days.
- **`e11-aguas-blancas`**: Gillingham places it "near Atoyac", calls it the Atoyac massacre and implies 1996. It was at
  Aguas Blancas, Coyuca de Benítez, on 28 Jun 1995; the governor left in Mar 1996.
- **`e11-mexico-city-1997`**: the book calls the IFE by its later name, INE.
- **`e11-yaqui-valley`**: the note adds Gillingham's 1976 redistribution of about 100,000 ha. This is not confirmed by a
  second source.
- Not tied to a feature: Gillingham (ch. 18) has the rector Barros Sierra leading the silent march of 13 September 1968.
  The rector led the march of 1 August; the silent march of 13 September was a separate event.

### Items from agent D's handoff (handoff-D.md)

- **Zacatepec**: the note on **`e11-jaramillo-1962`** now mentions Jaramillo's leadership at the Zacatepec cooperative mill in
  1942–43 (Padilla), refers to `e10-zacatepec-1938`, and gives Gillingham's description of the mill (ch. 17).
- **1940 election**: covered by the new **`e11-election-1940`**. Rubén Figueroa's killing of five voters in Guerrero in 1940
  (ch. 18) is in its note.
- **Retreat from Cardenismo** (Article 3 reform of 1946, *disolución social* in 1941, Fidel Velázquez at the CTM): these have
  no place, so they are not mapped and are left for the summary.
- **Women's suffrage**: still not mapped, because it has no place. Gillingham's dates (municipal vote 1947, presidential vote
  1958) agree with the standard ones: the 1953 federal reform, first federal vote in 1955, first presidential vote in 1958.

## Era 12: 2000 to the present (2000–2026)

- Fact-checked after the build; no features were added or removed. Every 2025–26 event was checked against at least two
  Mexican or international news organisations (El Universal, Milenio, Proceso, Expansión Política, El Financiero,
  Al Jazeera and others; Reuters, AP, BBC, El País and the NYT could not be reached by the checking tools). Details found
  in only one outlet were removed or moved to notes.

### Territories

- **`e12-cdmx-2016`** is the modern Natural Earth outline of the Ciudad de México (still labelled "Distrito Federal" in
  Natural Earth), drawn with the same union method as `npm run derive:states`. The date is the DOF publication of the
  reform (29 Jan 2016); the city's constitution followed on 5 Feb 2017.

### Routes

- **`e12-tren-maya`** is drawn through the 34 stations and paraderos of the official list (Fonatur, 2023: 20 stations and
  14 stops, 1,554 km), approximated by town coordinates; the fact-check added Tulum Aeropuerto and Conhuás (Calakmul),
  which the build had missed. Several stations lie outside their towns (Cancún Aeropuerto, Chetumal Aeropuerto, Tulum),
  and the track between stations is not traced. Openings: 15 Dec 2023 (Campeche–Cancún, two sources), 31 Dec 2023
  (Palenque–Campeche; service from 1 Jan 2024), 29 Feb 2024 (Cancún–Playa del Carmen), September 2024 (to Felipe Carrillo
  Puerto on the 20th and partly to Chetumal on the 29th, per Infobae and Wikipedia only, so given to the month) and
  15 Dec 2024 (Escárcega–Chetumal). A derailment at Izamal (19 Aug 2025) is not mapped.
- **`e12-interoceanic`** passes through Coatzacoalcos, Jáltipan, Medias Aguas, Jesús Carranza, Donají, Mogoñé, Matías
  Romero, Chivela, Nizanda, Ixtepec, Tehuantepec and Salina Cruz, following Milenio's station list (Sep 2024); Jesús
  Carranza and Tehuantepec were added in the fact-check. Nizanda is a planned station. It is open-ended (start only).
  Line K (from Ixtepec toward Ciudad Hidalgo; the first four stations, Tonalá, Arriaga, Chahuites and Juchitán, opened
  21 Nov 2025) is mentioned in the description but not drawn.
- **`e12-caravan-2018`** is schematic. The documented stops are Ciudad Hidalgo, Tapachula, Juchitán, Mexico City (the
  Jesús Martínez "Palillo" stadium), Guadalajara and Tijuana. Córdoba, Puebla, Querétaro, Hermosillo and Mexicali are
  plausible transit points, but I could not pin each one to a dated report. The ~1,200 km leg from Guadalajara to
  Hermosillo is a straight line.

### Dates and places

- **`e12-election-2000`** is marked at the IFE (now INE) headquarters; any Mexico City point would do.
- **`e12-atenco`**: the expropriation decree was published on 22 Oct 2001 (one source says 21 Oct), and the cancellation
  was announced on 1 Aug 2002. La Jornada says the abrogation decrees were published on 6 Aug; El Universal says 14 Aug.
  These dates come from search summaries of La Jornada and UNAM theses, which are not in the feature's sources (the
  Inter-American Court case and the Texcoco Airport article). The two deaths of May 2006 come from the Inter-American
  Court case.
- **`e12-pasta-de-conchos`**: the point is at Nueva Rosita, because the mine itself could not be geocoded; Wikipedia puts
  the mine about 10 km to the west (27.968°N, 101.328°W), not independently confirmed. Recovery counts differ (27 by
  Feb 2026 in Wikipedia, 26 by Apr 2026 in El Imparcial), so the description says "about two dozen".
- **`e12-operacion-michoacan`**: the first announcement listed 4,260 soldiers, 1,054 marines and ~300 federal police and
  prosecutors (wire report of 12 Dec 2006); later reports give up to 7,000. The point (Apatzingán) is schematic. The
  Uruapan heads (6 Sep 2006) follow Grayson (2010) and El Universal. Homicide figures are INEGI's (8,867 in 2007, 27,213
  in 2011), taken from press reports of INEGI data rather than INEGI's own tables.
- **`e12-juarez-2008`**: the end year of 2011 is a judgment. Homicides fell sharply from 2012.
- **`e12-san-fernando`**: the ranch (ejido El Huizachal) could not be geocoded, so the point is at the town. Sources
  give 24 or 25 August 2010 for the discovery.
- **`e12-autodefensas`**: the end of May 2014 (absorption into the Fuerza Rural) is approximate.
- **`e12-ayotzinapa-iguala`**: there were several attack sites, but the point is at the city centre. The Cocula dump is
  not mapped. Sources now include the GIEI report (2015), CNDH Recomendación 15VG/2018 and the CoVAJ report (2022).
  "Six killed" is the GIEI's count; "three identified" is confirmed as of Sep 2026 (Expansión). The arrest of the former
  governor Ángel Aguirre (6 Aug 2026) is reported by Proceso and others but is not included in the description.
- **`e12-culiacanazo`**: the January 2023 arrest is placed "near Culiacán". Jesús María, the usually reported place,
  is not confirmed in the sources I checked.
- **`e12-sinaloa-war`**: this is open-ended (from 9 Sep 2024). The "about 650 dead" figure could not be confirmed and was
  replaced by "more than 600 in the first hundred days" (Proceso); the state prosecutors counted 555 for 9 Sep–9 Dec.
- **`e12-otis`**, **`e12-aifa`**, **`e12-juarez-inm-fire`**: corrected against the NHC report, Wikipedia and the Texas
  Standard: AIFA is about 35 km (not 45 km) from the centre; the INM detainees were mostly Venezuelan.
- **`e12-quake-2017-cdmx`**: the point is near Álvaro Obregón 286, because the geocoder only resolves the avenue. The toll
  there, often given as 49, is not in the source I checked, so the description says "dozens".
- **`e12-texcoco-airport`**: the point is at the Lake Texcoco Ecological Park, as a stand-in for the NAIM terminal site.
  The start date of 2 Sep 2014 is the announcement; the end date of 27 Dec 2018 is when work stopped. The cancellation
  was announced on 29 Oct 2018 (from memory; the cited page gives the consultation and the halt).
- **`e12-juarez-inm-fire`**: the coordinates are from the Global Detention Project record. The toll is 40, though some
  reports say 38 or 39.
- **`e12-otis`**: the toll is now the government figure in the NHC report (52 dead, 32 missing); local critics say it is an
  undercount. Landfall winds follow the NHC's final estimate (140 kt, about 260 km/h).
- **`e12-teuchitlan`**: the searchers and the federal prosecutors still disagree about whether there were crematoria. The
  description gives both views. "Jalisco has the most missing" is now in the past tense: by late 2025 the State of
  Mexico had overtaken it.
- **`e12-floods-2025`**: interim tolls were 78 dead and 23 missing (22 Oct) and 80 and 18 (23 Oct); no final figure was
  found, so the description says "about 80 dead and some 20 missing". The builder's 6–11 Oct range and the "4 m" rise of
  the Cazones were not supported; the feature is now dated to the month, and the river's rise (reported as 2 m to more
  than 7 m) is not given.
- **`e12-manzo`**: 1 Nov 2025, about 20:00, at the municipal pergola during the Festival de Velas (El Financiero, Milenio,
  Al Jazeera). The CJNG attribution is the federal security secretary's (31 Jul 2026). The AP citation without a URL was
  replaced.
- **`e12-interoceanic-derailment`**: Semar's toll was 13 dead and 98 injured; El Universal later gives 14, in one outlet
  only, so the description keeps "at least 13" and mentions 14 as a later report. The excess-speed finding (65 km/h on a
  50 km/h curve) is from El Universal and La Jornada (headline only).
- **`e12-judicial-reform`**: "mostly close to the governing party" was softened to "widely seen as close to".
- **`e12-mencho`**: the reprisal toll is about 60 (25 National Guard members, two other officials, one civilian and about
  34 suspected gunmen; Milenio and Expansión), and Expansión's headline (58) does not match its own breakdown (~62). US
  intelligence support is from the defence secretary and Al Jazeera citing Reuters. "The most powerful criminal group"
  was softened to "one of Mexico's most powerful".
- **`e12-sheinbaum`**: "two-thirds majority in the Chamber of Deputies" is correct; the Senate supermajority came only
  after defections, so the description does not claim it.

### Sources

- Many recent features rest on Wikipedia articles and press reports, because there is little scholarship yet. All URLs
  were checked to resolve, and the key figures were checked against the pages. Meyer, Sherman & Deeds (2014) is cited
  only for 2000–2012 context.

### Not mapped

- **COVID-19 (2020–22)**, **USMCA/T-MEC (1 Jul 2020)**, the 2013–14 energy and education reforms, the US tariff disputes
  and the transfers of cartel prisoners to the US (2025), and the 2026 World Cup (opening match at Estadio Azteca,
  11 Jun 2026): no useful single location, or not historically settled. They belong in the summary, if anywhere.
- The **Zapatista March of 2001** (San Cristóbal to Mexico City, Feb–Mar 2001) was left out because I could not verify
  its stops.
- **Monterrey's 2011 Casino Royale attack**, the **2022 Monterrey water crisis** and **lithium nationalisation (2022)**
  were left out to keep the era readable.

### Book pass (Gillingham, *Mexico: A 500-Year History*, ch. 21 and Epilogue) ‡

The 2025–26 features were not touched; the book ends before them. Three features were added:

- ‡ **`e12-puente-grande`**: precise, at the prison. The laundry-cart account is the official version; Gillingham also cites
  Anabel Hernández's claim that Guzmán walked out of the front door.
- ‡ **`e12-avocado-michoacan`**: the dates 2009–2014 run from the start of the extortion to the autodefensas' takeover of the
  region. The extortion continued under other groups. The point is at Tancítaro, and the avocado belt is not drawn. The
  US$770 million figure is the Tancítaro growers' estimate, as reported by El Universal and InSight Crime.
- ‡ **`e12-javier-valdez`**: approximate, at the centre of Culiacán, where it shares a point with **`e12-culiacanazo`**. The
  Ríodoce office was not geocoded. Only one independent source (CPJ) was used.

### Differences from Gillingham

- **`e12-culiacanazo`**: 29 dead (ch. 21) is the toll of the January 2023 arrest. Reports for 17 Oct 2019 give 8 dead
  officially and up to 14.
- **`e12-san-fernando`**: 73 bodies (ch. 21) vs. 72 (CNDH) in 2010.
- **`e12-operacion-michoacan`**: 6,500 troops "into Michoacán and Guerrero" (ch. 21) vs. the first announcement's ~5,300 for
  Michoacán. The Guerrero operation began in January 2007.
- **`e12-avocado-michoacan`**: the book attributes the 2009 extortion to the Caballeros Templarios, which split from the
  Familia Michoacana only in 2011.
- **`e12-ayotzinapa-iguala`**: no conflict, but the note explains that the book's "six survivors" handed to the army are
  among the 43, and not the six people killed on the night.
- The book is added as a source on 13 existing features (election 2000, Campo Algodonero, election 2006, Operación
  Michoacán, Juárez, San Fernando, autodefensas, both Ayotzinapa features, Culiacanazo, AIFA, Tren Maya and Sheinbaum), as well as
  on the 3 additions. **`e12-ayotzinapa-normal`** now also names Genaro Vázquez as a graduate (CNDH efeméride).

## Sources

All book citations were checked for author, title, publisher and year, and every source URL was checked to
resolve. Some general works (e.g. Meyer, Sherman & Deeds) are cited as background for the broad picture rather
than for a specific detail; where a claim rests on one specific source, that source is listed first.
