import redis
import mysql.connector
from mysql.connector import Error

# Conexão com Redis
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)

# Função para validar dados
def validar_tarefa(titulo):
    if not titulo:
        raise ValueError("O título da tarefa não pode estar vazio")

# Conexão com MySQL
try:
    connection = mysql.connector.connect(
        host='localhost',
        database='tarefas_db',
        user='seu_usuario',
        password='sua_senha'
    )

    if connection.is_connected():
        print("Conectado ao MySQL")

        cursor = connection.cursor()

        # Exemplo de inserção de dados
        titulo_tarefa = "Minha Tarefa"
        descricao_tarefa = "Descrição da minha tarefa"
        
        # Valida título
        validar_tarefa(titulo_tarefa)
        
        # Insere tarefa no Redis (cache)
        redis_client.set('tarefa:1', f'{titulo_tarefa}:{descricao_tarefa}')
        
        # Insere tarefa no MySQL (persistência)
        cursor.execute("INSERT INTO tarefas (titulo, descricao) VALUES (%s, %s)", (titulo_tarefa, descricao_tarefa))
        connection.commit()

        print("Tarefa inserida com sucesso")

except Error as e:
    print(f"Erro ao conectar ao MySQL: {e}")

finally:
    if connection.is_connected():
        cursor.close()
        connection.close()
        print("Conexão com MySQL encerrada")
