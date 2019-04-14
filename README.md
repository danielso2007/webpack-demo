# Estudo de webpack

# Configurando o HtmlWebpackPlugin

HtmlWebpackPlugin por padrão, ela gerará seu próprio index.html arquivo, mesmo que já tenhamos um na dist/pasta.

Se você quiser saber mais sobre todos os recursos e opções que [HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin) oferece, então você deve ler sobre o HtmlWebpackPluginrepo.

Você também pode dar uma olhada no [html-webpack-template](https://github.com/jaketrent/html-webpack-template) que fornece alguns recursos extras além do modelo padrão.

```shell
npm install --save-dev html-webpack-plugin
```

# Limpar a /dist

Um plugin popular para gerenciar isso é o mesmo, [clean-webpack-plugin](https://www.npmjs.com/package/clean-webpack-plugin).

```shell
npm install --save-dev clean-webpack-plugin
```


# Gerando o CHANGELOG do projeto

```shell
npm run release -- --release-as 0.2.0  --dry-run

npm run release -- --release-as patch --dry-run

npm run release -- --release-as minor  --dry-run

npm run release -- --release-as major  --dry-run
```