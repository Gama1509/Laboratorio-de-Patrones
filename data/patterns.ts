export type Language = 'Java' | 'Python' | 'C++' | 'C';

export interface Block {
  id: string;
  content: string;
}

export interface Dropzone {
  id: string;
  expectedBlockId: string;
}

export interface ExerciseData {
  codeTemplate: string; // Use '[DROPZONE_1]' placeholder to render dropzones inline
  blocks: Block[];
  dropzones: Dropzone[];
}

export interface PatternConcept {
  definition: string;
  problem: string;
  solution: string;
  advantages: string[];
  disadvantages: string[];
  analogy?: string;
}

export interface PatternStructure {
  name: string;
  description: string;
}

export interface PatternDetails {
  explanation: string;
  structure: PatternStructure[];
  flow?: string;
}

export interface PatternTheory {
  title: string;
  description: string;
}

export interface PatternData {
  id: string;
  name: string;
  concept: PatternConcept;
  conceptImage: string;
  details: PatternDetails;
  exampleImage: string;
  exampleTheory: PatternTheory;
  examplePseudo: string;
  pseudoAnalysis?: string[];
  pseudoExplanation?: string;
  exercises: Record<Language, ExerciseData>;
}

export const patternsData: PatternData[] = [
  {
    id: 'adapter',
    name: 'Adapter',
    concept: {
      definition: 'El patrón Adapter (Adaptador) permite que interfaces incompatibles trabajen juntas, actuando como un traductor entre ellas.',
      problem: 'Tienes una clase o sistema útil cuya interfaz no es compatible con el resto del código, impidiendo su uso.',
      solution: 'Usar un Adapter como "traductor". Envuelve el objeto original, capturando las llamadas del cliente y traduciéndolas al formato que el objeto original entiende.',
      advantages: [
        'Principio de Responsabilidad Única: Separa la lógica de conversión del negocio principal.',
        'Principio de Abierto/Cerrado: Permite añadir nuevos adaptadores sin afectar al cliente existente.'
      ],
      disadvantages: [
        'Añade cierta complejidad al introducir nuevas clases e interfaces.'
      ],
      analogy: '🔌 Piensa en un adaptador de corriente: convierte un enchufe incompatible en uno funcional.'
    },
    conceptImage: "/images/adapter/adapterConcept.png",
    details: {
      explanation: 'El Adapter crea una clase intermedia que actúa como puente entre el cliente (que espera cierta interfaz) y el servicio legacy (con otra interfaz).',
      structure: [
        { name: 'Cliente', description: 'Clase que contiene la lógica del negocio y realiza llamadas al sistema.' },
        { name: 'Target (Interfaz Cliente)', description: 'Interfaz esperada por el cliente para comunicarse.' },
        { name: 'Adaptee (Servicio útil)', description: 'Clase o librería con interfaz incompatible que se desea usar.' },
        { name: 'Adapter (Adaptador)', description: 'Clase que traduce las llamadas del cliente a la interfaz del Adaptee.' }
      ],
      flow: '🔁 Flujo: Cliente → Adapter → Adaptee'
    },
    exampleImage: "/images/adapter/adapterejemplo.png",
    exampleTheory: {
      title: 'Uso de un dispositivo europeo en una toma mexicana',
      description: 'Imagina que compras una laptop en Europa, pero al llegar a México descubres que su enchufe no es compatible con la toma de corriente local. En lugar de modificar la laptop o la instalación eléctrica, utilizas un adaptador que traduce físicamente la conexión. De la misma forma, el patrón Adapter permite que dos interfaces incompatibles trabajen juntas sin modificar ninguna de las dos.'
    },
    examplePseudo: `Clase AdaptadorCorriente implementa ConexionMexicana
    atributo enchufeEuropeo  // Dispositivo con conexión incompatible

    metodo conectarDispositivo()
        mostrar "Intentando conectar dispositivo europeo"  // Entrada del cliente

        si enchufeEuropeo es nulo
            mostrar "Error: no hay dispositivo conectado"
            retornar null  // Evita continuar si falta el dispositivo

        conexionAdaptada ← convertirConexion(enchufeEuropeo)  // Conversión del Adapter
        mostrar "Conexión adaptada al formato mexicano"

        resultado ← conectar(conexionAdaptada)  // Uso final del dispositivo
        mostrar "Dispositivo conectado correctamente"

        retornar resultado

    metodo convertirConexion(enchufe)
        mostrar "Convirtiendo enchufe europeo a mexicano"
        retornar "enchufe compatible"

    metodo conectar(conexion)
        mostrar "Conectando dispositivo a la corriente"
        retornar "dispositivo encendido"`,
    pseudoAnalysis: [
      'El método principal recibe un dispositivo con un enchufe que no es compatible.',
      'Antes de conectarlo, el adaptador revisa que sí exista un dispositivo.',
      'El método convertirConexion() representa la traducción del enchufe europeo al formato mexicano.',
      'Después de adaptar la conexión, el método conectar() permite usar el dispositivo normalmente.',
      'El dispositivo original no se modifica; solo se adapta la forma en que se conecta.'
    ],

    pseudoExplanation: '💡 Este pseudocódigo muestra cómo el patrón Adapter toma una conexión incompatible, la transforma en una compatible y permite usar el dispositivo sin modificar su enchufe original.',
    exercises: {
      Java: {
        codeTemplate: `// 1. Interfaz esperada
interface ConexionMexicana {
    void conectarDispositivo();
}

// 2. Dispositivo incompatible
class EnchufeEuropeo {
    public String getTipo() {
        return "Europeo";
    }

    public void conectarEuropeo() {
        System.out.println("Dispositivo conectado con enchufe europeo.");
    }
}

// 3. Adapter
[DROPZONE_1] {
    private EnchufeEuropeo enchufe;

    public AdaptadorCorriente(EnchufeEuropeo enchufe) {
        this.enchufe = enchufe;
    }

    [DROPZONE_2] {
        System.out.println("Intentando conectar dispositivo europeo...");

        if (enchufe == null) {
            System.out.println("Error: no hay dispositivo conectado");
            return;
        }

        // Paso 1: validar tipo
        [DROPZONE_3]

        // Paso 2: conectar
        System.out.println("Conectando dispositivo...");
        [DROPZONE_4]
    }
}`,
        blocks: [
          { id: "block_a", content: "class AdaptadorCorriente implements ConexionMexicana" },
          { id: "block_b", content: "public void conectarDispositivo()" },
          {
            id: "block_c",
            content: `if (enchufe.getTipo().equals("Europeo")) {
            System.out.println("Adaptando conexión al formato mexicano...");
        }`
          },
          { id: "block_d", content: "enchufe.conectarEuropeo();" }
        ],
        dropzones: [
          { id: "DROPZONE_1", expectedBlockId: "block_a" },
          { id: "DROPZONE_2", expectedBlockId: "block_b" },
          { id: "DROPZONE_3", expectedBlockId: "block_c" },
          { id: "DROPZONE_4", expectedBlockId: "block_d" }
        ]
      },

      Python: {
        codeTemplate: `# 1. Interfaz esperada
class ConexionMexicana:
    def conectar_dispositivo(self):
        pass

# 2. Dispositivo incompatible
class EnchufeEuropeo:
    def get_tipo(self):
        return "Europeo"

    def conectar_europeo(self):
        print("Dispositivo conectado con enchufe europeo.")

# 3. Adapter
[DROPZONE_1]:
    def __init__(self, enchufe):
        self.enchufe = enchufe

    [DROPZONE_2]:
        print("Intentando conectar dispositivo europeo...")

        if not self.enchufe:
            print("Error: no hay dispositivo conectado")
            return

        # Paso 1
        [DROPZONE_3]

        # Paso 2
        print("Conectando dispositivo...")
        [DROPZONE_4]`,
        blocks: [
          { id: "p_block_1", content: "class AdaptadorCorriente(ConexionMexicana)" },
          { id: "p_block_2", content: "def conectar_dispositivo(self)" },
          {
            id: "p_block_3",
            content: `if self.enchufe.get_tipo() == "Europeo":
            print("Adaptando conexión al formato mexicano...")`
          },
          { id: "p_block_4", content: "self.enchufe.conectar_europeo()" }
        ],
        dropzones: [
          { id: "DROPZONE_1", expectedBlockId: "p_block_1" },
          { id: "DROPZONE_2", expectedBlockId: "p_block_2" },
          { id: "DROPZONE_3", expectedBlockId: "p_block_3" },
          { id: "DROPZONE_4", expectedBlockId: "p_block_4" }
        ]
      },

      'C++': {
        codeTemplate: `#include <iostream>
#include <string>
using namespace std;

// 1. Interfaz esperada
class ConexionMexicana {
public:
    virtual void conectarDispositivo() = 0;
};

// 2. Dispositivo incompatible
class EnchufeEuropeo {
public:
    string getTipo() {
        return "Europeo";
    }

    void conectarEuropeo() {
        cout << "Dispositivo conectado con enchufe europeo." << endl;
    }
};

// 3. Adapter
[DROPZONE_1] {
private:
    EnchufeEuropeo* enchufe;

public:
    AdaptadorCorriente(EnchufeEuropeo* enchufe) : enchufe(enchufe) {}

    [DROPZONE_2] {
        cout << "Intentando conectar dispositivo europeo..." << endl;

        if (!enchufe) {
            cout << "Error: no hay dispositivo conectado" << endl;
            return;
        }

        // Paso 1
        [DROPZONE_3]

        // Paso 2
        cout << "Conectando dispositivo..." << endl;
        [DROPZONE_4]
    }
};`,
        blocks: [
          { id: "cpp_1", content: "class AdaptadorCorriente : public ConexionMexicana" },
          { id: "cpp_2", content: "void conectarDispositivo() override" },
          {
            id: "cpp_3",
            content: `if (enchufe->getTipo() == "Europeo") {
            cout << "Adaptando conexión al formato mexicano..." << endl;
        }`
          },
          { id: "cpp_4", content: "enchufe->conectarEuropeo();" }
        ],
        dropzones: [
          { id: "DROPZONE_1", expectedBlockId: "cpp_1" },
          { id: "DROPZONE_2", expectedBlockId: "cpp_2" },
          { id: "DROPZONE_3", expectedBlockId: "cpp_3" },
          { id: "DROPZONE_4", expectedBlockId: "cpp_4" }
        ]
      },

      C: {
        codeTemplate: `#include <stdio.h>
#include <string.h>

typedef struct EnchufeEuropeo {
    char tipo[20];
} EnchufeEuropeo;

void conectarEuropeo() {
    printf("Dispositivo conectado con enchufe europeo.\\n");
}

// Adapter
[DROPZONE_1] {
    EnchufeEuropeo* enchufe;
} AdaptadorCorriente;

// Función de adaptación
[DROPZONE_2](AdaptadorCorriente* adapter) {
    printf("Intentando conectar dispositivo europeo...\\n");

    if (adapter->enchufe == NULL) {
        printf("Error: no hay dispositivo conectado\\n");
        return;
    }

    // Paso 1
    [DROPZONE_3]

    // Paso 2
    printf("Conectando dispositivo...\\n");
    [DROPZONE_4]
}`,
        blocks: [
          { id: "c_1", content: "typedef struct AdaptadorCorriente" },
          { id: "c_2", content: "void conectarDispositivo" },
          {
            id: "c_3",
            content: `if (strcmp(adapter->enchufe->tipo, "Europeo") == 0) {
        printf("Adaptando conexión al formato mexicano...\\n");
    }`
          },
          { id: "c_4", content: "conectarEuropeo();" }
        ],
        dropzones: [
          { id: "DROPZONE_1", expectedBlockId: "c_1" },
          { id: "DROPZONE_2", expectedBlockId: "c_2" },
          { id: "DROPZONE_3", expectedBlockId: "c_3" },
          { id: "DROPZONE_4", expectedBlockId: "c_4" }
        ]
      }
    }
  },
  {
    id: 'bridge',
    name: 'Bridge',
    concept: {
      definition: 'El patrón Bridge (Puente) permite separar una clase principal de la forma en que realiza su trabajo, para que ambas puedan cambiar de manera independiente.',

      problem: 'Cuando una clase mezcla varias características que pueden cambiar por separado, el número de combinaciones crece y el código se vuelve difícil de mantener.',

      solution: 'Separar una de las partes en otra jerarquía. La clase principal mantiene una referencia a esa implementación y delega en ella el trabajo específico.',

      advantages: [
        'Principio de Responsabilidad Única: Separa la lógica principal de la implementación específica.',
        'Principio de Abierto/Cerrado: Permite añadir nuevas implementaciones sin modificar la clase principal.'
      ],

      disadvantages: [
        'Añade cierta complejidad al introducir nuevas clases y relaciones.'
      ],

      analogy: '🎮 Piensa en un control remoto universal: el control sigue siendo el mismo, pero puede funcionar con diferentes marcas de televisores.'
    },
    conceptImage: "/images/bridge/bridgeConcept.webp",

    details: {
      explanation: 'El Bridge crea una separación entre la clase principal y la implementación concreta que realiza el trabajo, permitiendo que ambas evolucionen sin depender directamente una de la otra.',

      structure: [
        {
          name: 'Cliente',
          description: 'Clase que utiliza la abstracción principal.'
        },
        {
          name: 'Abstraction',
          description: 'Clase principal que define la operación general.'
        },
        {
          name: 'Implementor',
          description: 'Interfaz que define cómo se realiza la operación específica.'
        },
        {
          name: 'Concrete Implementor',
          description: 'Clases concretas que implementan distintas formas de funcionamiento.'
        }
      ],

      flow: '🔁 Flujo: Cliente → Abstraction → Implementor'

    },
    exampleImage: "/images/bridge/bridgeExample.webp",
    exampleTheory: {
      title: 'Control remoto universal con diferentes televisores',
      description: 'Imagina que tienes un control remoto universal que puede funcionar con distintas marcas de televisores, como Samsung o LG. El control mantiene las mismas funciones principales, como encender o cambiar canal, mientras que cada televisor implementa la forma específica en que responde. Así, puedes cambiar el tipo de control o la marca del televisor sin afectar a la otra parte.'
    },

    examplePseudo: `Clase ControlRemoto
    atributo televisor  // Dispositivo que ejecuta las acciones

    metodo usarControl()
        mostrar "Usando control remoto"  // Entrada del cliente

        si televisor es nulo
            mostrar "Error: no hay televisor conectado"
            retornar null  // Evita continuar sin dispositivo

        mostrar "El control no ejecuta acciones directamente"
        
        encenderTV()  // El control envía la orden
        cambiarCanal(5)

        mostrar "El televisor ejecutó las acciones"

        retornar "ok"

    metodo encenderTV()
        mostrar "Enviando señal de encendido al televisor"
        televisor.encender()  // El televisor hace el trabajo

    metodo cambiarCanal(canal)
        mostrar "Enviando señal para cambiar canal"
        televisor.cambiarCanal(canal)  // Delegación real


Clase Televisor
    metodo encender()
    metodo cambiarCanal(canal)`,

    pseudoAnalysis: [

      'El método usarControl() representa al usuario interactuando con el control remoto.',
      'Se valida que exista un televisor antes de enviar cualquier señal.',
      'El control remoto no ejecuta acciones, solo envía órdenes al televisor.',
      'Las acciones reales (encender, cambiar canal) se ejecutan dentro del televisor.',
      'El control puede trabajar con cualquier televisor sin cambiar su lógica.'

    ],

    pseudoExplanation: '💡 Este pseudocódigo muestra que el control remoto no realiza las acciones, sino que envía señales a un televisor que las ejecuta, permitiendo cambiar de dispositivo sin modificar el control.',
    exercises: {
      Java: {
        codeTemplate: `// 1. Implementación
interface Televisor {
    void encender();
}

// 2. Implementación concreta
class TVSamsung implements Televisor {
    public void encender() {
        System.out.println("Samsung encendida");
    }
}

// 3. Abstracción
[DROPZONE_1] {
    private Televisor tv;

    public ControlRemoto(Televisor tv) {
        this.tv = tv;
    }

    [DROPZONE_2] {
        System.out.println("Usando control remoto...");

        if (tv == null) {
            System.out.println("Error: no hay televisor conectado");
            return;
        }

        // Enviar señal
        [DROPZONE_3]

        System.out.println("Procesando señal...");

        // Ejecutar acción
        [DROPZONE_4]

        System.out.println("Acción ejecutada correctamente");
    }
}`,
        blocks: [
          { id: "b1", content: "class ControlRemoto" },
          { id: "b2", content: "public void encenderTV()" },
          { id: "b3", content: "System.out.println(\"Enviando señal de encendido...\");" },
          { id: "b4", content: "tv.encender();" }
        ],
        dropzones: [
          { id: "DROPZONE_1", expectedBlockId: "b1" },
          { id: "DROPZONE_2", expectedBlockId: "b2" },
          { id: "DROPZONE_3", expectedBlockId: "b3" },
          { id: "DROPZONE_4", expectedBlockId: "b4" }
        ]
      },
      Python: {
        codeTemplate: `# 1. Implementación
class Televisor:
    def encender(self):
        pass

# 2. Implementación concreta
class TVLG(Televisor):
    def encender(self):
        print("LG encendida")

# 3. Abstracción
[DROPZONE_1]:
    def __init__(self, tv):
        self.tv = tv

    [DROPZONE_2]:
        print("Usando control remoto...")

        if not self.tv:
            print("Error: no hay televisor conectado")
            return

        # Enviar señal
        [DROPZONE_3]

        print("Procesando señal...")

        # Ejecutar acción
        [DROPZONE_4]

        print("Acción ejecutada correctamente")`,
        blocks: [
          { id: "pb1", content: "class ControlRemoto" },
          { id: "pb2", content: "def encender_tv(self)" },
          { id: "pb3", content: "print(\"Enviando señal de encendido...\")" },
          { id: "pb4", content: "self.tv.encender()" }
        ],
        dropzones: [
          { id: "DROPZONE_1", expectedBlockId: "pb1" },
          { id: "DROPZONE_2", expectedBlockId: "pb2" },
          { id: "DROPZONE_3", expectedBlockId: "pb3" },
          { id: "DROPZONE_4", expectedBlockId: "pb4" }
        ]
      },
      'C++': {
        codeTemplate: `#include <iostream>
using namespace std;

// 1. Implementación
class Televisor {
public:
    virtual void encender() = 0;
};

// 2. Implementación concreta
class TVSamsung : public Televisor {
public:
    void encender() {
        cout << "Samsung encendida" << endl;
    }
};

// 3. Abstracción
[DROPZONE_1] {
private:
    Televisor* tv;

public:
    ControlRemoto(Televisor* tv) : tv(tv) {}

    [DROPZONE_2] {
        cout << "Usando control remoto..." << endl;

        if (!tv) {
            cout << "Error: no hay televisor conectado" << endl;
            return;
        }

        // Enviar señal
        [DROPZONE_3]

        cout << "Procesando señal..." << endl;

        // Ejecutar acción
        [DROPZONE_4]

        cout << "Acción ejecutada correctamente" << endl;
    }
};`,
        blocks: [
          { id: "cb1", content: "class ControlRemoto" },
          { id: "cb2", content: "void encenderTV()" },
          { id: "cb3", content: "cout << \"Enviando señal de encendido...\" << endl;" },
          { id: "cb4", content: "tv->encender();" }
        ],
        dropzones: [
          { id: "DROPZONE_1", expectedBlockId: "cb1" },
          { id: "DROPZONE_2", expectedBlockId: "cb2" },
          { id: "DROPZONE_3", expectedBlockId: "cb3" },
          { id: "DROPZONE_4", expectedBlockId: "cb4" }
        ]
      },
      C: {
        codeTemplate: `#include <stdio.h>

typedef struct Televisor {
    void (*encender)(struct Televisor*);
} Televisor;

void encenderSamsung(Televisor* tv) {
    printf("Samsung encendida\\n");
}

// Abstracción
[DROPZONE_1] {
    Televisor* tv;
} ControlRemoto;

// Función de control
[DROPZONE_2](ControlRemoto* control) {
    printf("Usando control remoto...\\n");

    if (control->tv == NULL) {
        printf("Error: no hay televisor conectado\\n");
        return;
    }

    // Enviar señal
    [DROPZONE_3]

    printf("Procesando señal...\\n");

    // Ejecutar acción
    [DROPZONE_4]

    printf("Acción ejecutada correctamente\\n");
}`,
        blocks: [
          { id: "c1", content: "typedef struct ControlRemoto" },
          { id: "c2", content: "void encenderTV" },
          { id: "c3", content: "printf(\"Enviando señal de encendido...\\n\");" },
          { id: "c4", content: "control->tv->encender(control->tv);" }
        ],
        dropzones: [
          { id: "DROPZONE_1", expectedBlockId: "c1" },
          { id: "DROPZONE_2", expectedBlockId: "c2" },
          { id: "DROPZONE_3", expectedBlockId: "c3" },
          { id: "DROPZONE_4", expectedBlockId: "c4" }
        ]
      },
    }
  },
  {
    id: 'composite',
    name: 'Composite',
    concept: {
      definition: 'Permite tratar objetos individuales y grupos de objetos de la misma forma.',

      problem: 'Cuando trabajas con elementos que pueden ser individuales o grupos (como productos y combos), tienes que verificar constantemente qué tipo es cada uno.',

      solution: 'Crear una interfaz común donde los elementos simples ejecutan la acción y los grupos delegan esa acción a sus elementos internos.',

      advantages: [
        'Permite usar objetos individuales y grupos de forma uniforme.',
        'Facilita agregar nuevos elementos sin cambiar el código existente.'
      ],

      disadvantages: [
        'Puede ser difícil limitar qué elementos pueden estar dentro de un grupo.'
      ],

      analogy: '🍔 Piensa en un restaurante: puedes pedir un producto individual o un combo, pero ambos se procesan de la misma forma.'
    },
    conceptImage: "/images/composite/compositeConcept.jpg",
    details: {
      explanation: 'El patrón Composite organiza los objetos en forma de árbol, donde tanto los elementos individuales como los grupos comparten la misma interfaz.',

      structure: [
        {
          name: 'Cliente',
          description: 'Usa los objetos sin importar si son individuales o grupos.'
        },
        {
          name: 'Component',
          description: 'Interfaz común que define las operaciones.'
        },
        {
          name: 'Leaf',
          description: 'Elemento individual que ejecuta la acción directamente.'
        },
        {
          name: 'Composite',
          description: 'Grupo de elementos que delega la acción a sus elementos internos.'
        }
      ],

      flow: '🔁 Flujo: Cliente → Component → (Leaf ejecuta | Composite delega a sus elementos)'
    },
    exampleImage: "/images/composite/compositeExample.jpeg",
    exampleTheory: {
      title: 'Pedidos individuales y combos en un restaurante',
      description: 'Imagina que estás en un restaurante. Puedes pedir un producto individual, como una hamburguesa, o un combo que incluye varios productos. Para el sistema del restaurante, ambos se procesan de la misma forma: simplemente se ejecuta la acción de procesar pedido. La diferencia es que un producto individual se procesa directamente, mientras que un combo procesa cada uno de sus productos internos.'
    },
    examplePseudo: `Clase Pedido  // Interfaz común
    metodo procesar()


Clase Producto implementa Pedido
    atributo nombre

    metodo procesar()
        mostrar "Preparando producto: " + nombre  // Caso simple (Leaf)
        retornar "ok"


Clase Combo implementa Pedido
    atributo productos  // Lista de pedidos (pueden ser productos o combos)

    metodo procesar()
        mostrar "Procesando combo"  // Entrada del grupo

        si productos está vacío
            mostrar "Error: el combo no tiene productos"
            retornar null  // Evita continuar sin elementos

        para cada producto en productos
            producto.procesar()  // Delegación a los elementos internos

        mostrar "Combo procesado correctamente"

        retornar "ok"`,
    pseudoAnalysis: [
      'Existe una interfaz común (Pedido) que permite tratar productos y combos de la misma forma.',
      'El Producto representa un elemento individual que ejecuta la acción directamente.',
      'El Combo representa un grupo que no ejecuta la acción por sí mismo, sino que delega a sus productos.',
      'La validación evita procesar un combo sin elementos.',
      'El cliente puede usar productos o combos sin cambiar su forma de interactuar.'
    ],
    pseudoExplanation: '💡 Este pseudocódigo muestra cómo un producto se procesa directamente, mientras que un combo delega el procesamiento a sus elementos, permitiendo tratar ambos de la misma forma.',
    exercises: {
      Java: {
        codeTemplate: `import java.util.*;

// 1. Interfaz común
interface Pedido {
    void procesar();
}

// 2. Producto individual
class Producto implements Pedido {
    public void procesar() {
        System.out.println("Preparando producto");
    }
}

// 3. Combo (Composite)
[DROPZONE_1] {
    private List<Pedido> pedidos;

    public Combo(List<Pedido> pedidos) {
        this.pedidos = pedidos;
    }

    [DROPZONE_2] {
        System.out.println("Procesando combo...");

        if (pedidos == null || pedidos.isEmpty()) {
            System.out.println("Error: no hay productos en el combo");
            return;
        }

        // Recorrer pedidos
        for ([DROPZONE_3]) {
            // Procesar cada uno
            [DROPZONE_4]
        }

        System.out.println("Combo procesado correctamente");
    }
}`,
        blocks: [
          { id: "cjb1", content: "class Combo implements Pedido" },
          { id: "cjb2", content: "public void procesar()" },
          { id: "cjb3", content: "Pedido p : pedidos" },
          { id: "cjb4", content: "p.procesar();" }
        ],
        dropzones: [
          { id: "DROPZONE_1", expectedBlockId: "cjb1" },
          { id: "DROPZONE_2", expectedBlockId: "cjb2" },
          { id: "DROPZONE_3", expectedBlockId: "cjb3" },
          { id: "DROPZONE_4", expectedBlockId: "cjb4" }
        ]
      },
      Python: {
        codeTemplate: `# 1. Interfaz común
class Pedido:
    def procesar(self):
        pass

# 2. Producto individual
class Producto(Pedido):
    def procesar(self):
        print("Preparando producto")

# 3. Combo
[DROPZONE_1]:
    def __init__(self, pedidos):
        self.pedidos = pedidos

    [DROPZONE_2]:
        print("Procesando combo...")

        if not self.pedidos:
            print("Error: no hay productos en el combo")
            return

        # Recorrer pedidos
        for [DROPZONE_3]:
            # Procesar cada uno
            [DROPZONE_4]

        print("Combo procesado correctamente")`,
        blocks: [
          { id: "cp1", content: "class Combo(Pedido)" },
          { id: "cp2", content: "def procesar(self)" },
          { id: "cp3", content: "p in self.pedidos" },
          { id: "cp4", content: "p.procesar()" }
        ],
        dropzones: [
          { id: "DROPZONE_1", expectedBlockId: "cp1" },
          { id: "DROPZONE_2", expectedBlockId: "cp2" },
          { id: "DROPZONE_3", expectedBlockId: "cp3" },
          { id: "DROPZONE_4", expectedBlockId: "cp4" }
        ]
      },
      'C++': {
        codeTemplate: `#include <iostream>
#include <vector>
using namespace std;

// 1. Interfaz común
class Pedido {
public:
    virtual void procesar() = 0;
};

// 2. Producto
class Producto : public Pedido {
public:
    void procesar() {
        cout << "Preparando producto" << endl;
    }
};

// 3. Combo
[DROPZONE_1] {
private:
    vector<Pedido*> pedidos;

public:
    Combo(vector<Pedido*> pedidos) : pedidos(pedidos) {}

    [DROPZONE_2] {
        cout << "Procesando combo..." << endl;

        if (pedidos.empty()) {
            cout << "Error: no hay productos en el combo" << endl;
            return;
        }

        for ([DROPZONE_3]) {
            [DROPZONE_4]
        }

        cout << "Combo procesado correctamente" << endl;
    }
};`,
        blocks: [
          { id: "cc1", content: "class Combo : public Pedido" },
          { id: "cc2", content: "void procesar() override" },
          { id: "cc3", content: "Pedido* p : pedidos" },
          { id: "cc4", content: "p->procesar();" }
        ],
        dropzones: [
          { id: "DROPZONE_1", expectedBlockId: "cc1" },
          { id: "DROPZONE_2", expectedBlockId: "cc2" },
          { id: "DROPZONE_3", expectedBlockId: "cc3" },
          { id: "DROPZONE_4", expectedBlockId: "cc4" }
        ]
      },
      C: {
        codeTemplate: `#include <stdio.h>

// Definición de Pedido con puntero a función
typedef struct Pedido {
    void (*procesar)(struct Pedido*);
} Pedido;

// Implementación concreta
void procesarProducto(Pedido* p) {
    printf("Preparando producto\\n");
}

// Composite
[DROPZONE_1] {
    Pedido** pedidos;
    int cantidad;
} Combo;

// Función de procesamiento
[DROPZONE_2](Combo* combo) {
    printf("Procesando combo...\\n");

    if (combo->cantidad == 0) {
        printf("Error: no hay productos en el combo\\n");
        return;
    }

    // Recorrer pedidos
    for ([DROPZONE_3]) {
        // Procesar cada pedido
        [DROPZONE_4]
    }

    printf("Combo procesado correctamente\\n");
}`,
        blocks: [
          { id: "cpc1", content: "typedef struct Combo" },
          { id: "cpc2", content: "void procesarCombo" },
          { id: "cpc3", content: "int i = 0; i < combo->cantidad; i++" },
          { id: "cpc4", content: "combo->pedidos[i]->procesar(combo->pedidos[i]);" }
        ],
        dropzones: [
          { id: "DROPZONE_1", expectedBlockId: "cpc1" },
          { id: "DROPZONE_2", expectedBlockId: "cpc2" },
          { id: "DROPZONE_3", expectedBlockId: "cpc3" },
          { id: "DROPZONE_4", expectedBlockId: "cpc4" }
        ]
      }
    }
  }
];
