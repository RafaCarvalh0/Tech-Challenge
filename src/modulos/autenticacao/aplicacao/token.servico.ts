export type PerfilUsuario = "ADMINISTRADOR";

export interface ServicoToken {
  gerar(usuario: string, perfil: PerfilUsuario): Promise<string>;
}
