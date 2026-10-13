# Fotos dos personagens

Coloque aqui as imagens, **uma por personagem**, nomeadas com o `id`:

```
public/chars/korg.jpg
public/chars/nebula.jpg
public/chars/wong.jpg
...
```

Depois, no arquivo `lib/characters.ts`, mude:

```ts
export const CHAR_IMAGES = true
```

Pronto: a foto aparece ao lado do nome (e o emoji vira reserva, caso algum
arquivo falte). Aceita `.jpg`, `.png`, `.webp` ou `.svg`; se quiser outro
formato, ajuste o campo `img` do personagem.

## Ids e filmes

| id | Personagem | Filme |
| --- | --- | --- |
| howard | Howard, o Pato | Guardiões da Galáxia |
| korg | Korg | Thor: Ragnarok |
| miek | Miek | Thor: Ragnarok |
| luis | Luis | Homem-Formiga |
| ned | Ned Leeds | Homem-Aranha: De Volta ao Lar |
| happy | Happy Hogan | Homem de Ferro |
| darcy | Darcy Lewis | Thor |
| woo | Jimmy Woo | Homem-Formiga e a Vespa |
| mobius | Mobius M. Mobius | Loki (série) |
| casey | Casey (TVA) | Loki (série) |
| okoye | Okoye | Pantera Negra |
| shuri | Shuri | Pantera Negra |
| nakia | Nakia | Pantera Negra |
| wong | Wong | Doutor Estranho |
| trevor | Trevor Slattery | Homem de Ferro 3 |
| kraglin | Kraglin | Guardiões da Galáxia |
| mantis | Mantis | Guardiões da Galáxia Vol. 2 |
| nebula | Nebula | Guardiões da Galáxia |
| yelena | Yelena Belova | Viúva Negra |
| kate | Kate Bishop | Gavião Arqueiro (série) |
| katy | Katy | Shang-Chi e a Lenda dos Dez Anéis |
| coulson | Phil Coulson | Os Vingadores |
| foggy | Foggy Nelson | Demolidor (série) |
| karen | Karen Page | Demolidor (série) |

> Use apenas imagens que você tem direito de usar. As fotos oficiais dos
> personagens são protegidas por direitos autorais da Marvel/Disney.
